import { PeriodicElementSevice } from './../../services/periodictElement.service';
import { MatTable, MatTableModule } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ElementDialogComponent } from 'src/app/shared/element-dialog/element-dialog.component';
import { PeriodicElement } from 'src/app/models/PeriodicElement';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [PeriodicElementSevice]
})
export class HomeComponent implements OnInit {
  @ViewChild(MatTable)
  table!: MatTable<any>;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'action'];
  dataSource!: PeriodicElement[]
  element = {} as PeriodicElement;
  elements!: PeriodicElement[];
  constructor(
    public dialog: MatDialog,
    public periodicElementSevice: PeriodicElementSevice,
    private elementService: PeriodicElementSevice
  ) {
 
  }

  ngOnInit() {
    this.getElements();
  }
  
 openDialog(element: PeriodicElement | null): void {
    const dialogRef = this.dialog.open(ElementDialogComponent, {
      width: '250px',
      data: element === null ? {
        id: null,
        name: "",
        weight: null,
        symbol: ""
      } : {
        id: element.id,
        name: element.name,
        weight: element.weight,
        symbol: element.symbol
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.dataSource.find(element => result.id == element.id )) {
        this.periodicElementSevice.updateElements(result).subscribe(() => {

        });
      } else {
        this.periodicElementSevice.saveElements(result).subscribe(() => {
        });
      }
    });
  } 
  
    getElements() {
      this.periodicElementSevice.getElements().subscribe((elements: PeriodicElement[]) => {
        this.dataSource = elements;
      });
    }
  
    deleteElement(element: PeriodicElement) {
      this.periodicElementSevice.deleteElement(element).subscribe(() => {
        this.getElements();
      });
    }
  
    editElement(element: PeriodicElement) {
      this.openDialog(element);
    }
  
    cleanForm(form: NgForm) {
      this.getElements();
      form.resetForm();
      this.element = {} as PeriodicElement;
    }

}
