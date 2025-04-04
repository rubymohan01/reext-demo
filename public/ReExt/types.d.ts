// types/reext.d.ts

declare module '@sencha/reext' {
    import * as React from 'react';

    interface Packages {
        charts: boolean;
        fontawesome: boolean;
        ux: boolean;
        calendar: boolean;
        d3: boolean;
        exporter: boolean;
        pivot: boolean;
        pivotd3: boolean;
        pivotlocale: boolean;
        froalaeditor: boolean;
      }
  
      interface ReExtData {
        sdkversion: string;
        toolkit: string;
        theme: string;
        packages?: Packages;
        rtl?: boolean;
        locale?: string;
        debug?: boolean;
        urlbase: string;
        location: string;
        overrides?: boolean;
        customfolder?: string;
        customfiles?: Array<string>;
      }    
  
    interface ReExtProviderProps {
      ReExtData: ReExtData;
      reextkey?: string;
      splash?: string;
      children?: React.ReactNode;
    }
  
    interface ReExtProps {
      xtype: string;
      childHeight?: number;
      childWidth?: number;

      rootStyle?: React.CSSProperties;
      rootClassName?: string;
      style?: React.CSSProperties;
      className?: string;
      config?: Record<string, any>;
      ready?: () => void;
      [key: `on${string}`]: ((...args: any[]) => void) | undefined;
    }
  
    export class ReExtProvider extends React.Component<ReExtProviderProps> {}
    export default class ReExt extends React.Component<ReExtProps> {}
  }