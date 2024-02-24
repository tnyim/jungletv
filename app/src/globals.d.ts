declare module "*.css" {
    const style: CSSStyleSheet
    export default style;
}

declare namespace svelte.JSX {
    interface DOMAttributes<T> {
      onclickoutside?: EventHandler<CustomEvent<Event>>;
    }
  }