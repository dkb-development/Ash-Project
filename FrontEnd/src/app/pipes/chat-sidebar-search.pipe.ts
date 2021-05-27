import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chatSidebarSearch'
})
export class ChatSidebarSearchPipe implements PipeTransform {

  transform(items: Emp[], searchText: string): unknown {
    return null;
  }

}

class Emp{
  username!: string;
  email!: string;
}