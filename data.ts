
import { Norm, User, UserRole } from './types';

export const MOCK_USERS: User[] = [
  { id: 'admin01', username: 'admin', role: UserRole.ADMIN },
  { id: 'dir01', username: 'directivo', role: UserRole.DIRECTIVO },
];

export const MOCK_NORMS: Norm[] = [
  {
    id: 'reg-acad-001',
    title: 'Reglamento Académico General',
    shortTitle: 'RAG',
    description: 'Norma que rige los procesos académicos de la universidad.',
    tags: ['académico', 'estudiantes', 'evaluación'],
    isConfidential: false,
    versions: [
      {
        version: 1,
        date: '2022-08-15T10:00:00Z',
        content: `
# Reglamento Académico General
## Versión 1

### Artículo 10: De las Calificaciones
Las calificaciones se expresarán en una escala de 0 a 100 puntos. La nota mínima para aprobar una asignatura es de 70 puntos.

### Artículo 25: De la Asistencia
Se requiere un mínimo del 80% de asistencia a clases para tener derecho a examen final.
        `,
        modification: null,
      },
      {
        version: 2,
        date: '2023-05-20T14:30:00Z',
        content: `
# Reglamento Académico General
## Versión 2

### Artículo 10: De las Calificaciones
Las calificaciones se expresarán en una escala de 0 a 100 puntos. La nota mínima para aprobar una asignatura es de 75 puntos.

### Artículo 25: De la Asistencia
Se requiere un mínimo del 80% de asistencia a clases para tener derecho a examen final.

### Artículo 26: Modalidades de Graduación
Se añade la modalidad de graduación por proyecto de grado.
        `,
        modification: {
          modifyingNormId: 'res-cu-050-2023',
          modifyingNormTitle: 'Resolución del Consejo Universitario N° 050-2023',
          summary: 'Se eleva la nota mínima de aprobación a 75 puntos y se añade una nueva modalidad de graduación.',
          appliedBy: 'admin01',
          appliedAt: '2023-05-20T14:30:00Z',
        },
      },
    ],
  },
  {
    id: 'res-cu-050-2023',
    title: 'Resolución del Consejo Universitario N° 050-2023',
    shortTitle: 'RCU-050',
    description: 'Resolución que modifica el Reglamento Académico General.',
    tags: ['resolución', 'modificación', 'consejo universitario'],
    isConfidential: false,
    versions: [
       {
        version: 1,
        date: '2023-05-19T09:00:00Z',
        content: `
# Resolución del Consejo Universitario N° 050-2023

### Artículo 1: Modificación del Artículo 10 del RAG
Modifíquese el artículo 10 del Reglamento Académico General, el cual quedará redactado de la siguiente manera:
"Las calificaciones se expresarán en una escala de 0 a 100 puntos. La nota mínima para aprobar una asignatura es de 75 puntos."

### Artículo 2: Adición del Artículo 26 al RAG
Añádase el artículo 26 al Reglamento Académico General con el siguiente texto:
"Se añade la modalidad de graduación por proyecto de grado."
        `,
        modification: null,
      }
    ]
  },
  {
    id: 'norm-conf-001',
    title: 'Protocolo de Inversiones Estratégicas',
    shortTitle: 'PIE',
    description: 'Documento que detalla las políticas y procedimientos para inversiones mayores a $1M.',
    tags: ['financiero', 'inversiones', 'confidencial'],
    isConfidential: true,
    versions: [
      {
        version: 1,
        date: '2024-01-10T11:00:00Z',
        content: `
# Protocolo de Inversiones Estratégicas
## Versión 1

Este documento es confidencial y solo para uso del personal directivo.

### Sección 1: Aprobación de Proyectos
Todo proyecto de inversión que supere el millón de dólares debe ser aprobado por el Comité Financiero y ratificado por Rectoría.
        `,
        modification: null,
      },
    ],
  },
];
