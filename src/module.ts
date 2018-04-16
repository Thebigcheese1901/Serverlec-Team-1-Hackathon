import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgLibrary, SymbolType, SymbolInputType, ConfigPropType } from './framework';
import { LibModuleNgFactory } from './module.ngfactory';

import { ExampleComponent } from './example/example.component';
import { PIInterfaceMonitorComponent } from './PIInterfaceMonitor/PIInterfaceMonitor.component';

@NgModule({
  declarations: [ ExampleComponent, PIInterfaceMonitorComponent ],
  imports: [ CommonModule ] ,
  exports: [ ExampleComponent, PIInterfaceMonitorComponent ],
  entryComponents: [ ExampleComponent, PIInterfaceMonitorComponent ]
})
export class LibModule { }

export class ExtensionLibrary extends NgLibrary {
  module = LibModule;
  moduleFactory = LibModuleNgFactory;
  symbols: SymbolType[] = [
    {
      name: 'example-symbol',
      displayName: 'Example Symbol',
      dataParams: { shape: 'single' },
      thumbnail: '^/assets/images/example.svg',
      compCtor: ExampleComponent,
      inputs: [
        SymbolInputType.Data,
        SymbolInputType.PathPrefix
      ],
      generalConfig: [
        {
          name: 'Example Options',
          isExpanded: true,
          configProps: [
            { propName: 'bkColor', displayName: 'Background color', configType: ConfigPropType.Color, defaultVal: 'white' },
            { propName: 'fgColor', displayName: 'Color', configType: ConfigPropType.Color, defaultVal: 'black' }
          ]
        }
      ],
      layoutWidth: 200,
      layoutHeight: 100
    },
    {
      name: 'PIInterfaceMonitor-symbol',
      displayName: 'PIInterfaceMonitor Symbol',
      dataParams: { shape: 'trend' },
      thumbnail: '^/assets/images/PIInterfaceMonitor.svg',
      compCtor: PIInterfaceMonitorComponent,
      inputs: [
        SymbolInputType.Data,
        SymbolInputType.PathPrefix,
        SymbolInputType.Shape
      ],
      generalConfig: [
        {
          name: 'PI Interface Monitor Options',
          isExpanded: true,
          configProps: [
            { propName: 'bkColor', displayName: 'Background color', configType: ConfigPropType.Color, defaultVal: 'white' },
          ]
        }
      ],
      layoutWidth: 200,
      layoutHeight: 100
    }
  ];
}
