import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'postType'
})
export class PostTypePipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if(!items) return [];
    if(!searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter( it => {
          return it.post_info.media_type.toLowerCase().includes(searchText);
        });
    
  }

}
