import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosLaboralesComponent } from './datos-laborales.component';

describe('DatosLaboralesComponent', () => {
  let component: DatosLaboralesComponent;
  let fixture: ComponentFixture<DatosLaboralesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosLaboralesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatosLaboralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
