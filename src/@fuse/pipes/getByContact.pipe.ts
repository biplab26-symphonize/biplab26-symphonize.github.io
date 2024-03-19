import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'getByContact',
    pure: false
})
export class GetByContactPipe implements PipeTransform
{
    /**
     * Transform
     *
     * @param {any[]} value
     * @param {number} id
     * @param {string} property
     * @returns {any}
     */
    transform(value: any[], id: number, property: string, defaultValue: string): any
    {
        const foundItem = value.find(item => {
            if ( item.contactinfo !== undefined && item.contactinfo.contact_id!==undefined )
            {
                return item.contactinfo.contact_id === id;
            }

            return false;
        });

        if ( foundItem  && foundItem.contactinfo)
        {
            if(foundItem.contactinfo[property]=="" && foundItem.contactinfo[property]!==undefined && foundItem.contactinfo[property]!==null){
                return defaultValue;
            }
            else{
                return foundItem.contactinfo[property];
            }
            
        }
    }
}
