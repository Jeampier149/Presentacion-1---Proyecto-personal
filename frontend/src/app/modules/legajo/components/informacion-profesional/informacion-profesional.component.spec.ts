import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionProfesionalComponent } from './informacion-profesional.component';

describe('InformacionProfesionalComponent', () => {
  let component: InformacionProfesionalComponent;
  let fixture: ComponentFixture<InformacionProfesionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformacionProfesionalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InformacionProfesionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
