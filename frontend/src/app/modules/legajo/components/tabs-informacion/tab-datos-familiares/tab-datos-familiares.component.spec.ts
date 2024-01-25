import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabDatosFamiliaresComponent } from './tab-datos-familiares.component';

describe('TabDatosFamiliaresComponent', () => {
  let component: TabDatosFamiliaresComponent;
  let fixture: ComponentFixture<TabDatosFamiliaresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabDatosFamiliaresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabDatosFamiliaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
