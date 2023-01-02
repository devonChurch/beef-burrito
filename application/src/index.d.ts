declare module "potato/App" {
    export function start(): Promise<{
        dom(element: HTMLElement): void;
    }>
}
