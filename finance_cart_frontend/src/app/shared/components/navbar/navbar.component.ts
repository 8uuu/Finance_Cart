import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/app.reducer';
import { setSelectedTasa } from 'src/app/redux/actions/person.actions';

interface MenuItem {
  ruta: string;
  text: string;
  icon: string;
  action:string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  public menu: MenuItem[] = [];
  public selectedTasa: string = 'Efectiva';
  public listTasa: any[] = [
    { id: 0, name: 'Efectiva', valor:true },
    { id: 1, name: 'Nominal', valor: false },
  ];
  
  public localStorageId = localStorage.getItem('id') || null;

  constructor(private router: Router, private store: Store<IAppState>) {}

  ngOnInit(): void {
    localStorage.setItem('selectedTasa', this.selectedTasa);
    this.store.select("ui").subscribe(resp => {
      if( this.localStorageId != null){
        this.menu = [
          { ruta: '/personProfiles', text: 'Inicio', icon: '', action:'' },
          { ruta: '/personProfiles/letras', text: 'Letra', icon: '', action:'' },
          { ruta: '/personProfiles/facturas', text: 'Factura', icon: '', action:'' },
          { ruta: '/personProfiles/recibos', text: 'Recibo', icon: '', action:'' },
          { ruta: '/auth/login', text: 'Cerrar sesión', icon: 'logout', action:'logout' },
        ];
      }
    })

  }

  public selectTasa(opt: any) {
    console.log('selectTasa: ',opt.value);
    this.store.dispatch(setSelectedTasa({setSelectedTasa:opt.value}))
    // localStorage.setItem('selectedTasa', this.selectedTasa);
    // this.router.navigateByUrl('http://localhost:4200/personProfiles/facturas');
  }

  public action(action:any){
    if(action === 'logout'){
      localStorage.clear();
      // this.store.dispatch(setRolAction({setRolAction: 0}));
      this.router.navigate(['auth/login']);
    }
  }
}
