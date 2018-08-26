import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
    Utils
} from './core/core';
import {
    DataService
} from './services/data.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    public form: FormGroup;
    public ingredientCount: number = 0;
    public loading: boolean = false;
    public page: number = 1;
    public recipeName: string = '';
    public url: string = '';

    private _results: any[] = [];

    constructor(
        private dataService: DataService,
        private fb: FormBuilder
    ) { }

    public ngOnInit() {
        this.form = this.fb.group({
            ingredients: ['pesto', Validators.required],
            recipe: ['lasagna', Validators.required]
        });
    }

    public onSubmit(): void {
        this.loading = true;
        this.recipeName = 'loading...';
        this.url = '';
        this.ingredientCount = 0;
        this._results = [];
        this._search();
    }

    private _processResults(): void {
        const n = this._results.length;
        if (n > 0) {
            const results = [];
            const addResult = (r) => {
                results.push(r);
                if (results.length === n) {
                    results.forEach((r_) => {
                        if (!Utils.isNullOrEmpty(r_.href)) {
                            const c = r_.ingredients
                                .split(',')
                                .filter((s) => {
                                    return !Utils.isNullOrEmpty(s);
                                })
                                .length;

                            if (c > this.ingredientCount) {
                                this.ingredientCount = c;
                                this.recipeName = r_.title;
                                this.url = r_.href;
                            }
                        }
                    });

                    this.loading = false;
                }
            };

            this.ingredientCount = 0;

            this._results.forEach((r, i) => {
                this.dataService.getUrl(r.href).subscribe((d_: any) => {
                    if (!Utils.isNullOrEmpty(d_)) {
                        addResult(r);
                    }
                }, () => {
                    r.href = '';
                    addResult(r);
                });
            });
        } else {
            this.recipeName = 'none found';
        }
    }

    private _search(): void {
        const i = this.form.value['ingredients'];
        const r = this.form.value['recipe'];
        this.dataService.get(i, r, this.page).subscribe((d: any) => {
            if ((d.results !== undefined) && (d.results.length > 0)) {
                this._results = this._results.concat(d.results);
                this.page++;
                this._search();
            } else {
                this._processResults();
            }
        }, () => {
            this._processResults();
        });
    }
}
