import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { provideHttpClient } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { closeCircle, checkmarkCircle, heart, arrowUndoCircle, arrowUndoCircleOutline } from 'ionicons/icons';

addIcons({
  'close-circle': closeCircle,
  'checkmark-circle': checkmarkCircle,
  'heart': heart,
  'arrow-undo-circle-outline': arrowUndoCircleOutline
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideHttpClient(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
