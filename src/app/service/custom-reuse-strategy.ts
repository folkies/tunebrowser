import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';
import { Injectable } from "@angular/core";

@Injectable()
export class CustomReuseStrategy implements RouteReuseStrategy {

    private handlers: { [key: string]: DetachedRouteHandle } = {};

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        // Don't cache set view and editor components to ensure they reload fresh data
        const path = route.routeConfig?.path;
        if (path === 'set/:id' || path === 'set/:id/edit') {
            return false;
        }
        return true;
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        this.handlers[route.url.join('/') || route.parent.url.join('/')] = handle;
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return !!this.handlers[route.url.join('/') || route.parent.url.join('/')];
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        return this.handlers[route.url.join('/') || route.parent.url.join('/')];
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
    }
}