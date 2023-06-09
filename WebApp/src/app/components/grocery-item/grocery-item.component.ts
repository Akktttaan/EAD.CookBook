import {Component, OnInit} from '@angular/core';
import {CookBookClient, DishType, GroceryItem, UnitOfMeasure} from "../../../api/CoobBookClient";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {BehaviorSubject, filter, first, merge, Subject, tap} from "rxjs";
import {AddEditDialogComponent} from "../../dialogs/add-edit-dialog/add-edit-dialog.component";
import {AddEditGroceryItemComponent} from "../../dialogs/add-edit-grocery-item/add-edit-grocery-item.component";
import {ErrorHandlerService} from "../../dialogs/error/error-handler.service";

@Component({
  selector: 'app-grocery-item',
  templateUrl: './grocery-item.component.html',
  styleUrls: ['./grocery-item.component.sass']
})
export class GroceryItemComponent implements OnInit {
  errorSbj = new Subject<string>()
  refreshSbj = new BehaviorSubject<boolean>(true);
  groceryItems: DishType[] = [];
  displayedColumns: string[] = [];
  unitOfMeasures: UnitOfMeasure[] = [];

  constructor(private api: CookBookClient,
              private dialog: MatDialog,
              private error: ErrorHandlerService) {
    merge(this.refreshSbj)
      .subscribe(() => {
        api.itemAll()
          .pipe(first())
          .subscribe(x => this.groceryItems = x);
      })
    this.api.unitOfMeasureAll()
      .subscribe(data => {
        this.unitOfMeasures = data;
      })

    this.error.showError(this.errorSbj)
  }

  ngOnInit(): void {
    this.displayedColumns = ['name', 'unitOfMeasure', 'price', 'actions'];
  }

  addGroceryItem() {
    this.dialog.open(AddEditGroceryItemComponent, {
      width: '400px',
      data: {
        title: 'Добавить продукт',
        unitOfMeasures: this.unitOfMeasures
      }
    })
      .afterClosed()
      .pipe(
        first(),
        tap((x: GroceryItem) => {
          if(this.groceryItems.map(x => x.name).includes(x.name)){
            this.errorSbj.next("Такой продукт уже существует!")
          }
        }),
        filter(x => !!x && !this.groceryItems.map(x => x.name).includes(x.name))
      )
      .subscribe(data => {
        this.api.itemPOST(data)
          .subscribe(() => this.refreshSbj.next(true));
      });
  }

  editGroceryItem(element: GroceryItem) {
    this.dialog.open(AddEditGroceryItemComponent, {
      width: '400px',
      data: {
        title: 'Изменить продукт',
        unitOfMeasures: this.unitOfMeasures,
        data: element
      }
    })
      .afterClosed()
      .pipe(first(), filter(x => !!x))
      .subscribe(data => {
        this.api.itemPUT(data)
          .subscribe(() => this.refreshSbj.next(true));
      });
  }

  deleteGroceryItem(element: GroceryItem) {
    this.api.itemDELETE(element.id)
      .subscribe(() => this.refreshSbj.next(true))
  }
}
