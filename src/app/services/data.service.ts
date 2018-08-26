import {
    Injectable
} from '@angular/core';
import {
    HttpClient
} from '@angular/common/http';
import {
    Utils
} from '../core/core';

@Injectable()
export class DataService {

    private _url: string = 'http://www.recipepuppy.com/api';

    constructor(
        private http: HttpClient
    ) { }

    public get(ingredients: string = '', recipe: string = '', page: number = 1) {
        const params: string[] = [];
        if (!Utils.isNullOrEmpty(ingredients)) {
            params.push(`i=${encodeURI(ingredients)}`);
        }
        if (!Utils.isNullOrEmpty(recipe)) {
            params.push(`q=${encodeURI(recipe)}`);
        }
        params.push('p=' + page);

        const url = `${this._url}?${params.join('&')}`;

        return this.http.get(url);
    }

    public getUrl(url: string) {
        return this.http.get(url, {
            responseType: 'text'
        });
    }
}
