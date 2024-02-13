import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SituacionLaboralActualComponent } from './situacion-laboral-actual.component';

describe('SituacionLaboralActualComponent', () => {
  let component: SituacionLaboralActualComponent;
  let fixture: ComponentFixture<SituacionLaboralActualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SituacionLaboralActualComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SituacionLaboralActualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
