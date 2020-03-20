import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'SpCalendarWebPartStrings';
import SpCalendar from './components/SpCalendar';
import { ISpCalendarProps } from './components/ISpCalendarProps';
import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';

export interface ISpCalendarWebPartProps {
  description: string;
}

export default class SpCalendarWebPart extends BaseClientSideWebPart<ISpCalendarWebPartProps> {
  public httpClient: AadHttpClient;
  esdData: any;
  protected onInit(): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (error: any) => void): void => {
      this.context.aadHttpClientFactory
        .getClient('9bd18247-0a8a-49bf-aef5-ccc640785be0')
        .then((client: AadHttpClient): void => {
          this.httpClient = client;
          resolve();
        }, err => reject(err));
    });
  }
  public render(): void {
    const element: React.ReactElement<ISpCalendarProps > = React.createElement(
      SpCalendar,
      {
        context: this.context,
        client: this.httpClient
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
