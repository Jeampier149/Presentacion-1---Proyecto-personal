import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabDatosProfesionalesComponent } from './tab-datos-profesionales.component';

describe('TabDatosProfesionalesComponent', () => {
  let component: TabDatosProfesionalesComponent;
  let fixture: ComponentFixture<TabDatosProfesionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabDatosProfesionalesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabDatosProfesionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
