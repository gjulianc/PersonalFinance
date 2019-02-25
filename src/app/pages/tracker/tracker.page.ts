import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, Platform, IonList, PopoverController } from '@ionic/angular';
import { CashFlowModalPage } from '../cash-flow-modal/cash-flow-modal.page';
import { Storage } from '@ionic/storage';
import { CashService, Transaction, CashFlow } from 'src/app/services/cash.service';
import { FilterPopoverPage } from '../filter-popover/filter-popover.page';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.page.html',
  styleUrls: ['./tracker.page.scss'],
})
export class TrackerPage implements OnInit {

  selectedCurrency='';
  transactions: Transaction[] = [];
  allTransactions: Transaction[] = [];

  cashFlow = 0;

  @ViewChild('slidingList') slidingList: IonList
  constructor(
    private modalCtrl: ModalController,
    private storage: Storage,
    private cashService: CashService,
    private plt: Platform,
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {

    
  }

  async ionViewWillEnter() {
    
    await this.plt.ready();

    this.loadTransactions();
  }

  async addCashFlow() {
    let modal = await this.modalCtrl.create({
      component: CashFlowModalPage,
      cssClass: 'modalCss'
    });

    modal.present();

    modal.onDidDismiss().then( res => {
      if( res && res.data ) {
        this.loadTransactions();
      }
    });
  }

  async loadTransactions() {
    await this.storage.get('selected-currency').then ( currency => {
      this.selectedCurrency = currency.toUpperCase();
    });


    await this.cashService.getTransactions().then( data => {
      this.transactions = data;
      this.allTransactions = data;
    });
    console.log(this.transactions);
    this.updateCashFlow();
  }

  async removeTransaction(i) {
    
    this.transactions.splice(i, 1);
    this.cashService.updateTransactions(this.transactions);
    await this.slidingList.closeSlidingItems();
    this.updateCashFlow();
  }

  updateCashFlow() {
    let result = 0;

    this.transactions.map( trans => {
      result += trans.type == CashFlow.Expense ? -trans.value : trans.value;
    }); // Esto es equivalente a un for como el que está comenta abajo

    // for ( let i = 0; i< this.transactions.length; i++ ) {
    //   if ( this.transactions[i].type ) {
    //     cashFlow += this.transactions[i].value;
    //   } else {
    //     cashFlow -= this.transactions[i].value;
    //   }
    // }
    
    this.cashFlow = result;
  }

  async openFilter( e ) {
    const popover  = await this.popoverCtrl.create({
      component: FilterPopoverPage,
      event: e
    });

    await popover.present();

    popover.onDidDismiss().then(resp => {
      if (resp && resp.data ) {

        let selectedName = resp.data.selected.name;

        if (resp.data.selected.name == 'All') {
          this.transactions = this.allTransactions;
        } else {
          this.transactions = this.allTransactions.filter(trans => {
            return trans.category.name == selectedName;
          });
        };

        this.updateCashFlow();
      }
    });

    
  }

}
