import { Component, OnInit } from "@angular/core";
import { isAndroid } from "platform";
import { SelectedIndexChangedEventData, TabView } from "tns-core-modules/ui/tab-view";

@Component({
  selector: "TabsComponent",
  moduleId: module.id,
  templateUrl: "./tabs.component.html",
  styleUrls: ['./tabs.component.css'],
})
export class TabsComponent implements OnInit {
  private _title: string = 'Endava Angular ML App';

  constructor() {
  }

  ngOnInit(): void {
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    if (this._title !== value) {
      this._title = value;
    }
  }

  onSelectedIndexChanged(args: SelectedIndexChangedEventData) {
    const tabView = <TabView>args.object;
    const selectedTabViewItem = tabView.items[args.newIndex];

    this.title = selectedTabViewItem.title;
  }
}
