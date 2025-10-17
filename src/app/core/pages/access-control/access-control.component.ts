import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-access-control-page',
  standalone: true,
  imports: [],
  templateUrl: './access-control.component.html'
})
export class AccessControlPageComponent implements OnInit {
  //private permissionService = new UserPermissionService(null as any);
  ngOnInit(): void {}
}

//   allPermissions = signal<UserPermission[]>([]);
//   filters = signal({
//     searchTerm: '',
//     nameFilter: '',
//     emailFilter: '',
//     permissionFilter: ''
//   });

//   // Computed signal para filtrar permisos
//   filteredPermissions = computed(() => {
//     const permissions = this.allPermissions();
//     const { searchTerm, nameFilter, emailFilter, permissionFilter } = this.filters();

//     return permissions.filter(permission => {
//       // Búsqueda general
//       if (searchTerm) {
//         const search = searchTerm.toLowerCase();
//         const matchesSearch =
//           permission.userName.toLowerCase().includes(search) ||
//           permission.userEmail.toLowerCase().includes(search) ||
//           permission.permissionName.toLowerCase().includes(search);
//         if (!matchesSearch) return false;
//       }

//       // Filtro por nombre
//       if (nameFilter && !permission.userName.toLowerCase().includes(nameFilter.toLowerCase())) {
//         return false;
//       }

//       // Filtro por correo
//       if (emailFilter && !permission.userEmail.toLowerCase().includes(emailFilter.toLowerCase())) {
//         return false;
//       }

//       // Filtro por permiso
//       if (permissionFilter && permission.permissionName !== permissionFilter) {
//         return false;
//       }

//       return true;
//     });
//   });

//   ngOnInit() {
//     this.loadPermissions();
//   }

//   loadPermissions() {
//     this.permissionService.getPermissions().subscribe(
//       permissions => this.allPermissions.set(permissions)
//     );
//   }

//   onFilterChange(filters: any) {
//     this.filters.set(filters);
//   }

//   onEdit(id: string) {
//     console.log('Editar permiso:', id);
//     // Implementar lógica de edición
//   }

//   onDelete(id: string) {
//     if (confirm('¿Está seguro de eliminar este permiso?')) {
//       console.log('Eliminar permiso:', id);
//       // Implementar lógica de eliminación
//       const updated = this.allPermissions().filter(p => p.id !== id);
//       this.allPermissions.set(updated);
//     }
//   }
// }
