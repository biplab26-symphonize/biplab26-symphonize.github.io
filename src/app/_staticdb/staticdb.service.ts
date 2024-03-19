import { InMemoryDbService } from 'angular-in-memory-web-api';
import { IconsFakeDb } from 'app/_staticdb/icons';
import { FontAwesomeIcons } from 'app/_staticdb/fa-icons';
export class StaticDbService implements InMemoryDbService
{
    createDb(): any
    {
        return {            
            // Icons
            'icons': IconsFakeDb.icons,
            'faicons': FontAwesomeIcons.icons,
        };
    }
}
