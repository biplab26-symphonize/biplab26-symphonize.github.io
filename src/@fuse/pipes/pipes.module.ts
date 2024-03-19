import { NgModule } from '@angular/core';

import { KeysPipe } from './keys.pipe';
import { GetByIdPipe } from './getById.pipe';
import { GetByContactPipe } from './getByContact.pipe';
import { HtmlToPlaintextPipe } from './htmlToPlaintext.pipe';
import { FilterPipe } from './filter.pipe';
import { CamelCaseToDashPipe } from './camelCaseToDash.pipe';
import { SlugifyPipe } from './slugify.pipe';
import { SanitizeHtmlPipe } from './sanitize-html.pipe';
import { DateSuffixPipe } from './dateSuffix.pipe';
import { DateFilterPipe } from './dateFilter.pipe';

@NgModule({
    declarations: [
        KeysPipe,
        GetByIdPipe,
        GetByContactPipe,
        HtmlToPlaintextPipe,
        FilterPipe,
        CamelCaseToDashPipe,
        SlugifyPipe,
        SanitizeHtmlPipe,
        DateSuffixPipe,
        DateFilterPipe
    ],
    imports     : [],
    exports     : [
        KeysPipe,
        GetByIdPipe,
        GetByContactPipe,
        HtmlToPlaintextPipe,
        FilterPipe,
        CamelCaseToDashPipe,
        SlugifyPipe,
        SanitizeHtmlPipe,
        DateSuffixPipe,
        DateFilterPipe
    ]
})
export class FusePipesModule
{
}
