// Global type declarations for static assets
declare module '*.css';
declare module '*.module.css' {
  const styles: { readonly [key: string]: string };
  export default styles;
}
