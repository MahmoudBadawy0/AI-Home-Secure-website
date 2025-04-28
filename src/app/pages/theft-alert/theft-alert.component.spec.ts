import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheftAlertComponent } from './theft-alert.component';

describe('TheftAlertComponent', () => {
  let component: TheftAlertComponent;
  let fixture: ComponentFixture<TheftAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TheftAlertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TheftAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
