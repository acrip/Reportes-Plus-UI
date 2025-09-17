import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientosHeaderComponent } from './movimientos-header.component';

describe('MovimientosHeaderComponent', () => {
  let component: MovimientosHeaderComponent;
  let fixture: ComponentFixture<MovimientosHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimientosHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimientosHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
