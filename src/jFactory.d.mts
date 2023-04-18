import { JQuery } from 'jquery';

export declare class JFactoryComponent{
    constructor(name:string)

    onInstall: () => any;
    onEnable: () => any;
    onDisable: () => any;
    onUninstall: () => any;

    readonly $install?: () => Promise<void>;
    readonly $enable?: () => Promise<void>;
    readonly $disable?: () => Promise<void>;
    readonly $uninstall?: () => Promise<void>;

    readonly $log?: (...args: any[]) => void;
    readonly $dom?: (
        id: string,
        jQueryArgument: string | JQuery<HTMLElement>,
        appendTo?: string | JQuery<HTMLElement>
    ) => JQuery<HTMLElement>;
    readonly $domFetch?: (
        id: string,
        url: string,
        fetchOptions?: RequestInit,
        appendTo?: string | JQuery<HTMLElement>
    ) => Promise<JQuery<HTMLElement>>;
    readonly $cssFetch?: (
        id: string,
        url: string,
        appendTo?: string | JQuery<HTMLElement>
    ) => Promise<JQuery<HTMLElement>>;
    readonly $interval?: (
        id: string,
        delay: number,
        handler: (...args: any[]) => void,
        ...args: any[]
    ) => number;
    readonly $fetchText?:(
        id: string,
        url: string,
        fetchOptions?: RequestInit,
    ) => Promise<String>
    readonly $fetchJSON?:(
        id: string,
        url: string,
        fetchOptions?: RequestInit,
    ) => Promise<JSON>
}

export interface JFactoryComponentType extends JFactoryComponent {
    [key: string]: unknown;
}

export declare function jFactory(name: string, obj: JFactoryComponentType): JFactoryComponentType;