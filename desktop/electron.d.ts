export { };

declare global {
    interface Window {
        api: {
            customTitleBar?: boolean;
            close: () => void;
            minimize: () => void;
            maximize: () => void;
            openExternal: (url: string) => void;
        };
    }
}
