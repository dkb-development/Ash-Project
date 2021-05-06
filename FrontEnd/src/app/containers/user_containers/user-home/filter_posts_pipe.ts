import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter_posts'
})
export class FilterPostsPipe implements PipeTransform {
  transform(items: Post[], searchText: string): any[] {
    if(!items) return [];
    if(!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter( it => 
        {
            return it.type.includes(searchText);
        });
   }
}

class Post{
    name: string;
    type: string;
}