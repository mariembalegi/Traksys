import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {Piece} from '../../models/piece';
import {Project} from '../../models/project';
import {Resource} from '../../models/resource';
import {Task} from '../../models/task';

@Component({
  selector: 'app-project-details',
  imports: [
    DatePipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './project-details.html',
  styleUrl: './project-details.scss'
})
export class ProjectDetails implements OnInit {
  projectId!: number;
  projects: Project[] = [
    {
      id: 1,
      name: "Project Alpha",
      designPicture: "https://picsum.photos/200/120?random=5",
      designFile: "",
      description: "Small desktop CNC prototype",
      customerId: "C01",
      progress: 50,
      opened: new Date("2025-08-01"),
      delivery: new Date("2025-08-20"),
      invoiceAmount: 1500,
      currency: "USD",
      isOpen: true
    },
    {
      id: 2,
      name: "Project Beta",
      designPicture: "https://picsum.photos/200/120?random=5",
      designFile: "",
      description: "Decorative CNC engraving pattern",
      customerId: "C02",
      progress: 80,
      opened: new Date("2025-07-15"),
      delivery: new Date("2025-08-30"),
      invoiceAmount: 2500,
      currency: "EUR",
      isOpen: false
    },
    {
      id: 3,
      name: "Project Gamma",
      designPicture: "https://picsum.photos/200/120?random=5",
      designFile: "",
      description: "Architectural CNC modeling",
      customerId: "C03",
      progress: 30,
      opened: new Date("2025-06-10"),
      delivery: new Date("2025-09-01"),
      invoiceAmount: 1800,
      currency: "USD",
      isOpen: true
    },
    {
      id: 4,
      name: "Project Delta",
      designPicture: "https://picsum.photos/200/120?random=5",
      designFile: "",
      description: "Cabinet CNC design layout",
      customerId: "C01",
      progress: 100,
      opened: new Date("2025-05-05"),
      delivery: new Date("2025-07-20"),
      invoiceAmount: 3200,
      currency: "EUR",
      isOpen: false
    },
    {
      id: 5,
      name: "Project Epsilon",
      designPicture: "https://picsum.photos/200/120?random=5",
      designFile: "",
      description: "Random placeholder design",
      customerId: "C04",
      progress: 60,
      opened: new Date("2025-07-01"),
      delivery: new Date("2025-08-25"),
      invoiceAmount: 2100,
      currency: "USD",
      isOpen: true
    },
    {
      id: 6,
      name: "Project Zeta",
      designPicture: "https://picsum.photos/200/120?random=5",
      designFile: "",
      description: "CNC metal cutting prototype",
      customerId: "C02",
      progress: 40,
      opened: new Date("2025-08-05"),
      delivery: new Date("2025-09-15"),
      invoiceAmount: 2700,
      currency: "USD",
      isOpen: true
    },
    {
      id: 7,
      name: "Project Eta",
      designPicture: "https://picsum.photos/200/120?random=5",
      designFile: "",
      description: "CNC woodworking furniture design",
      customerId: "C03",
      progress: 75,
      opened: new Date("2025-06-25"),
      delivery: new Date("2025-08-28"),
      invoiceAmount: 3500,
      currency: "EUR",
      isOpen: false
    },
    {
      id: 8,
      name: "Project Theta",
      designPicture: "https://picsum.photos/200/120?random=5",
      designFile: "",
      description: "Precision CNC spare parts",
      customerId: "C01",
      progress: 20,
      opened: new Date("2025-07-10"),
      delivery: new Date("2025-09-05"),
      invoiceAmount: 1200,
      currency: "USD",
      isOpen: true
    },
    {
      id: 9,
      name: "Project Iota",
      designPicture: "https://picsum.photos/200/120?random=5",
      designFile: "",
      description: "Custom CNC signage project",
      customerId: "C04",
      progress: 90,
      opened: new Date("2025-05-22"),
      delivery: new Date("2025-08-18"),
      invoiceAmount: 2800,
      currency: "EUR",
      isOpen: false
    },
    {
      id: 10,
      name: "Project Kappa",
      designPicture: "https://picsum.photos/200/120?random=5",
      designFile: "",
      description: "Industrial CNC automation module",
      customerId: "C02",
      progress: 65,
      opened: new Date("2025-06-30"),
      delivery: new Date("2025-09-10"),
      invoiceAmount: 4000,
      currency: "USD",
      isOpen: true
    }
  ];
  pieces: Piece[] = [
    {
      reference: "1",
      name: "Engine Bracket",
      description: "Support métallique utilisé pour fixer le moteur au châssis.",
      designFile: "/files/engine-bracket-cad.dwg",
      designPicture: "https://picsum.photos/200/120?random=5",
      material: "Acier",
      materialQuantity: 12,
      materialUnit: "kg",
      quantity: 50,
      progress: 45,
      status: "In Progress"
    },
    {
      reference: "2",
      name: "Gear Shaft",
      description: "Arbre mécanique transmettant le mouvement entre engrenages.",
      designFile: "/files/gear-shaft-cad.dwg",
      designPicture: "https://picsum.photos/200/120?random=5",
      material: "Alliage aluminium",
      materialQuantity: 8,
      materialUnit: "kg",
      quantity: 30,
      progress: 10,
      status: "To Do"
    }
  ];
  resources: Resource[] = [
    {id: "R1", name: "Ali Ben Salah", type: "Person"},
    {id: "R2", name: "CNC Machine A1", type: "Machine"},
    {id: "R3", name: "Sara Trabelsi", type: "Person"},
    {id: "R4", name: "Robot Arm X2", type: "Machine"}
  ];
  tasks: Task[] = [
    {
      id: 101,
      name: "Metal Cutting",
      description: "Cut raw steel sheets according to blueprint.",
      estimatedTime: 8,
      spentTime: 6,
      quantity: 120,
      progress: 75,
      status: "In Progress",
      resources: ["R1", "R2"],
      dueDate: new Date("2025-08-20"),
      actualFinishDate: undefined,
      createdBy: "R1",
      creationDate: new Date("2025-08-15")
    },
    {
      id: 102,
      name: "Engine Assembly",
      description: "Assemble all engine components.",
      estimatedTime: 15,
      spentTime: 15,
      quantity: 60,
      progress: 100,
      status: "Completed",
      resources: ["R3", "R4"],
      dueDate: new Date("2025-08-16"),
      actualFinishDate: new Date("2025-08-16"),
      createdBy: "R1",
      creationDate: new Date("2025-08-14")
    },
    {
      id: 103,
      name: "Quality Control",
      description: "Check all produced pieces for conformity.",
      estimatedTime: 5,
      spentTime: 2,
      quantity: 200,
      progress: 40,
      status: "In Progress",
      resources: ["R1"],
      dueDate: new Date("2025-08-21"),
      actualFinishDate: undefined,
      createdBy: "R1",
      creationDate: new Date("2025-08-15")
    },
    {
      id: 104,
      name: "Painting",
      description: "Apply industrial paint to finished parts.",
      estimatedTime: 10,
      spentTime: 0,
      quantity: 0,
      progress: 0,
      status: "To Do",
      resources: ["R4"],
      dueDate: new Date("2025-08-25"),
      actualFinishDate: undefined,
      createdBy: "R1",
      creationDate: new Date("2025-08-17")
    }
  ];
  selectedProject: any;
  lineOpen: string | null = null;


  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'))!;
    this.selectedProject = this.projects.find(p => p.id === this.projectId);
  }

  toggleDropdown(id: string) {
    this.lineOpen = this.lineOpen === id ? null : id;
  }

  getResourceName(customerId: string): string {
    const resource = this.resources.find(r => r.id === customerId);
    return resource ? resource.name : "";
  }

  deletePiece(index: number) {
    this.pieces.splice(index, 1);
  }
  deleteTask(index: number) {
    this.tasks.splice(index, 1);
  }
}
