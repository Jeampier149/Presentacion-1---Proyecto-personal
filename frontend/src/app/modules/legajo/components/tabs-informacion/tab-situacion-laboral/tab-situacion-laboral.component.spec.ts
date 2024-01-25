import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabSituacionLaboralComponent } from './tab-situacion-laboral.component';

describe('TabSituacionLaboralComponent', () => {
  let component: TabSituacionLaboralComponent;
  let fixture: ComponentFixture<TabSituacionLaboralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabSituacionLaboralComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabSituacionLaboralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
