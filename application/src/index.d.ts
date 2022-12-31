declare module "beefBurritoPotato/App" {
    export function start(): Promise<{
        dom(element: HTMLElement): void;
    }>
}
