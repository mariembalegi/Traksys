import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DatePipe, NgForOf, NgIf, Location} from '@angular/common';
import {Piece} from '../../models/piece';
import {Project} from '../../models/project';
import {Resource} from '../../models/resource';
import {Task} from '../../models/task';
import {Dialog} from '@angular/cdk/dialog';
import {AddEditPieceModal} from '../../components/add-edit-piece-modal/add-edit-piece-modal';
import {AddEditTaskModal} from '../../components/add-edit-task-modal/add-edit-task-modal';
import {Material} from '../../models/material';

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
  projectId!: string;
  projects: Project[] = [
    {
      id: "p1",
      name: "CNC Machine Housing",
      description: "Project for producing CNC machine housing parts.",
      designPicture: "https://picsum.photos/200/120?random=5",
      designFile: "/designs/cnc_project.dxf",
      customerId: "c1",
      pieceIds: ["pc1", "pc2"],
      progress: 65,
      opened: new Date("2025-08-01"),
      delivery: new Date("2025-09-15"),
      invoiceAmount: 15000,
      currency: "EUR",
      isOpen: true
    },
    {
      id: "p2",
      name: "Robotic Arm",
      description: "Fabrication of components for robotic arm prototype.",
      designPicture: "https://picsum.photos/200/120?random=5",
      designFile: "/designs/robotic_arm.dxf",
      customerId: "c2",
      pieceIds: ["pc3"],
      progress: 20,
      opened: new Date("2025-08-10"),
      delivery: new Date("2025-10-01"),
      invoiceAmount: 8000,
      currency: "EUR",
      isOpen: true
    }
  ];
  pieces: Piece[] =  [
    {
      id: "pc1",
      reference: "HSG-001",
      name: "Housing Base",
      description: "Base plate for CNC machine housing.",
      designFile: "/designs/housing_base.dxf",
      designPicture: "https://picsum.photos/200/120?random=5",
      materialId: "m1",
      materialQuantity: 2,
      materialUnit: "kg",
      quantity: 10,
      progress: 80,
      status: "In Progress",
      taskIds: ["t1", "t2"]
    },
    {
      id: "pc2",
      reference: "HSG-002",
      name: "Side Panel",
      description: "Steel side panel for CNC machine.",
      designFile: "/designs/side_panel.dxf",
      designPicture: "https://picsum.photos/200/120?random=5",
      materialId: "m2",
      materialQuantity: 5,
      materialUnit: "kg",
      quantity: 20,
      progress: 50,
      status: "In Progress",
      taskIds: ["t3"]
    },
    {
      id: "pc3",
      reference: "RB-001",
      name: "Arm Joint",
      description: "Steel joint for robotic arm.",
      designFile: "/designs/arm_joint.dxf",
      designPicture: "https://picsum.photos/200/120?random=5",
      materialId: "m2",
      materialQuantity: 3,
      materialUnit: "kg",
      quantity: 15,
      progress: 10,
      status: "To Do",
      taskIds: ["t4"]
    }
  ];
  resources: Resource[] =  [
    { id: "r1", name: "CNC Operator", type: "Person", taskIds: ["t1", "t4"] },
    { id: "r2", name: "Lathe Machine", type: "Machine", taskIds: ["t1"] },
    { id: "r3", name: "Welder", type: "Person", taskIds: ["t3"] }
  ];
  tasks: Task[] = [
    {
      id: "t1",
      name: "Cut Base Plate",
      description: "Cut aluminium bar to base plate dimensions.",
      estimatedTime: 5,
      spentTime: 4,
      quantity: 10,
      progress: 80,
      status: "In Progress",
      resourceIds: ["r1", "r2"],
      commentIds: ["cm1"],
      dueDate: new Date("2025-08-25"),
      actualFinishDate: undefined,
      createdBy: "r1",
      creationDate: new Date("2025-08-15")
    },
    {
      id: "t2",
      name: "Drill Holes",
      description: "Drill mounting holes into base plate.",
      estimatedTime: 3,
      spentTime: 0,
      quantity: 10,
      progress: 0,
      status: "To Do",
      resourceIds: ["r1"],
      commentIds: [],
      dueDate: new Date("2025-08-28"),
      actualFinishDate: undefined,
      createdBy: "r1",
      creationDate: new Date("2025-08-16")
    },
    {
      id: "t3",
      name: "Weld Side Panel",
      description: "Weld side panel for CNC housing.",
      estimatedTime: 6,
      spentTime: 2,
      quantity: 20,
      progress: 30,
      status: "In Progress",
      resourceIds: ["r3"],
      commentIds: ["cm2"],
      dueDate: new Date("2025-09-05"),
      actualFinishDate: undefined,
      createdBy: "r3",
      creationDate: new Date("2025-08-18")
    },
    {
      id: "t4",
      name: "Polish Joint",
      description: "Surface finishing for robotic arm joint.",
      estimatedTime: 4,
      spentTime: 0,
      quantity: 15,
      progress: 0,
      status: "To Do",
      resourceIds: ["r1"],
      commentIds: [],
      dueDate: new Date("2025-09-10"),
      actualFinishDate: undefined,
      createdBy: "r1",
      creationDate: new Date("2025-08-20")
    }
  ];

  materials: Material[] = [
    {
      id: "m1",
      material: "Aluminium",
      type: "6061",
      quantity: 120,
      shape: "Cylindrical Bar",
      unit: "mm",
      last_updated: new Date("2025-08-20"),
      diameter: 50,
      length: 2000,
      pieceIds: ["pc1"]
    },
    {
      id: "m2",
      material: "Steel",
      type: "C55",
      quantity: 80,
      shape: "Plate",
      unit: "mm",
      last_updated: new Date("2025-08-18"),
      x: 1000,
      y: 500,
      thickness: 20,
      pieceIds: ["pc2", "pc3"]
    }
  ];

  selectedProject: any;
  lineOpenSet: Set<string> = new Set();
  dialog1=inject(Dialog);
  dialog2=inject(Dialog);
  protected AddEditPieceModal (){
    this.dialog1.open(AddEditPieceModal)
  }
  protected AddEditTaskModal (){
    this.dialog2.open(AddEditTaskModal)
  }

  constructor(private location: Location, private route: ActivatedRoute) {}

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id')!;
    this.selectedProject = this.projects.find(p => p.id === this.projectId);
  }

  toggleDropdown(id: string) {
    if (this.lineOpenSet.has(id)) {
      this.lineOpenSet.delete(id); // ferme si déjà ouvert
    } else {
      this.lineOpenSet.add(id); // ouvre sinon
    }
  }

  expandAll() {
    this.lineOpenSet = new Set(this.pieces.map(p => p.reference)); // ouvre toutes les pièces
  }

  collapseAll() {
    this.lineOpenSet.clear(); // ferme tout
  }

  isOpen(id: string): boolean {
    return this.lineOpenSet.has(id);
  }

  getResourceName(customerId: string): string {
    const resource = this.resources.find(r => r.id === customerId);
    return resource ? resource.name : "";
  }
  getMaterial(materialId: string): Material | undefined {
    const material = this.materials.find(m => m.id === materialId);
    return material ;
  }

  deletePiece(index: number) {
    this.pieces.splice(index, 1);
  }
  deleteTask(index: number) {
    this.tasks.splice(index, 1);
  }


}
