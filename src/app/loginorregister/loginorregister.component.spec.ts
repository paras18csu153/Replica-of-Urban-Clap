import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginorregisterComponent } from './loginorregister.component';

describe('LoginorregisterComponent', () => {
  let component: LoginorregisterComponent;
  let fixture: ComponentFixture<LoginorregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginorregisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginorregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
