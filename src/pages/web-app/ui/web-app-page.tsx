import { router, Stack } from 'expo-router';
import { HeaderBackButton } from 'expo-router/react-navigation';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, BackHandler, Linking, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import { useSession } from '@/entities/session';
import { env, originOf } from '@/shared/config';
import { errorMessage } from '@/shared/api';
import { confirm, useTheme } from '@/shared/lib';
import { HeaderIconButton, StateMessage } from '@/shared/ui';

import { parseWebAppMessage, sessionInjectionScript } from '../lib/bridge';
import { shareFile } from '../lib/share-file';

const isWebAppUrl = (url: string) => originOf(url) === env.webOrigin;

function openExternally(url: string) {
  if (originOf(url)) {
    WebBrowser.openBrowserAsync(url).catch(() => undefined);
  } else {
    Linking.openURL(url).catch(() => undefined);
  }
}

export function WebAppPage() {
  const theme = useTheme();
  const { session, syncSession } = useSession();
  const webView = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  const injectedSession = useMemo(() => sessionInjectionScript(session, env.webOrigin), [session]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!canGoBack) return false;
      webView.current?.goBack();
      return true;
    });
    return () => subscription.remove();
  }, [canGoBack]);

  const exitToApps = async () => {
    const confirmed = await confirm({
      title: 'Exit BiletFlow?',
      message: 'You will go back to the app choice screen.',
      confirmLabel: 'Exit',
      destructive: true,
    });
    if (confirmed) router.dismissTo('/');
  };

  const onMessage =(event: WebViewMessageEvent) => {
    if (!isWebAppUrl(event.nativeEvent.url)) return;
    const message = parseWebAppMessage(event.nativeEvent.data);
    if (!message) return;

    if (message.type === 'session') {
      syncSession(message.session).catch(() => undefined);
    } else {
      shareFile(message.fileName, message.mimeType, message.base64).catch((error: unknown) =>
        Alert.alert('Could not save the file', errorMessage(error)),
      );
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={[styles.flex, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          gestureEnabled: !canGoBack,
          headerLeft: canGoBack
            ? (props) => (
                <HeaderBackButton
                  {...props}
                  label="Back"
                  style={styles.headerBack}
                  onPress={() => webView.current?.goBack()}
                />
              )
            : undefined,
          headerRight: () => (
            <HeaderIconButton
              icon="rectangle.portrait.and.arrow.right"
              label="Exit to apps"
              tintColor={theme.onPrimary}
              onPress={exitToApps}
            />
          ),
        }}
      />
      <StatusBar style="light" />
      <WebView
        ref={webView}
        source={{ uri: env.webUrl }}
        style={[styles.flex, { backgroundColor: theme.background }]}
        injectedJavaScriptBeforeContentLoaded={injectedSession}
        onMessage={onMessage}
        onNavigationStateChange={(state) => setCanGoBack(state.canGoBack)}
        onShouldStartLoadWithRequest={(request) => {
          if (!request.isTopFrame || isWebAppUrl(request.url) || request.url.startsWith('about:')) return true;
          openExternally(request.url);
          return false;
        }}
        onOpenWindow={({ nativeEvent }) => openExternally(nativeEvent.targetUrl)}
        allowsBackForwardNavigationGestures
        startInLoadingState
        renderLoading={() => (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.background }]}>
            <StateMessage loading />
          </View>
        )}
        renderError={() => (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.background }]}>
            <StateMessage
              title="Can't reach BiletFlow"
              message={`Check your connection. The app loads ${env.webUrl}.`}
              action={{ label: 'Try again', onPress: () => webView.current?.reload() }}
            />
          </View>
        )}
        webviewDebuggingEnabled={__DEV__}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  headerBack: {
    marginLeft: -16,
  },
});
