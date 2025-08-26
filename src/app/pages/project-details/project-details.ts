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
      designPicture: "https://picsum.photos/200/120?random=1",
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
      designPicture: "https://picsum.photos/200/120?random=2",
      designFile: "/designs/robotic_arm.dxf",
      customerId: "c2",
      pieceIds: ["pc3"],
      progress: 20,
      opened: new Date("2025-08-10"),
      delivery: new Date("2025-10-01"),
      invoiceAmount: 8000,
      currency: "EUR",
      isOpen: true
    },
    {
      id: "p3",
      name: "Industrial Valve Assembly",
      description: "Manufacturing precision valve components for industrial applications.",
      designPicture: "https://picsum.photos/200/120?random=3",
      designFile: "/designs/valve_assembly.dxf",
      customerId: "c1",
      pieceIds: ["pc4", "pc5"],
      progress: 85,
      opened: new Date("2025-07-15"),
      delivery: new Date("2025-08-30"),
      invoiceAmount: 22000,
      currency: "EUR",
      isOpen: true
    },
    {
      id: "p4",
      name: "Automotive Bracket",
      description: "Custom bracket design for automotive suspension system.",
      designPicture: "https://picsum.photos/200/120?random=4",
      designFile: "/designs/auto_bracket.dxf",
      customerId: "c2",
      pieceIds: ["pc6"],
      progress: 45,
      opened: new Date("2025-08-05"),
      delivery: new Date("2025-09-20"),
      invoiceAmount: 5500,
      currency: "EUR",
      isOpen: true
    },
    {
      id: "p5",
      name: "Aerospace Component",
      description: "High-precision aerospace components with tight tolerances.",
      designPicture: "https://picsum.photos/200/120?random=5",
      designFile: "/designs/aerospace_comp.dxf",
      customerId: "c1",
      pieceIds: ["pc7", "pc8"],
      progress: 30,
      opened: new Date("2025-08-12"),
      delivery: new Date("2025-11-10"),
      invoiceAmount: 35000,
      currency: "EUR",
      isOpen: true
    },
    {
      id: "p6",
      name: "Marine Equipment",
      description: "Corrosion-resistant marine equipment fabrication.",
      designPicture: "https://picsum.photos/200/120?random=6",
      designFile: "/designs/marine_equip.dxf",
      customerId: "c2",
      pieceIds: ["pc9"],
      progress: 70,
      opened: new Date("2025-07-25"),
      delivery: new Date("2025-09-05"),
      invoiceAmount: 18500,
      currency: "EUR",
      isOpen: true
    },
    {
      id: "p7",
      name: "Medical Device Parts",
      description: "Precision medical device components requiring FDA compliance.",
      designPicture: "https://picsum.photos/200/120?random=7",
      designFile: "/designs/medical_parts.dxf",
      customerId: "c1",
      pieceIds: ["pc10", "pc11"],
      progress: 95,
      opened: new Date("2025-06-20"),
      delivery: new Date("2025-08-25"),
      invoiceAmount: 28000,
      currency: "EUR",
      isOpen: false
    },
    {
      id: "p8",
      name: "Construction Hardware",
      description: "Heavy-duty construction hardware components.",
      designPicture: "https://picsum.photos/200/120?random=8",
      designFile: "/designs/construction_hw.dxf",
      customerId: "c3",
      pieceIds: ["pc12"],
      progress: 55,
      opened: new Date("2025-08-02"),
      delivery: new Date("2025-09-30"),
      invoiceAmount: 12000,
      currency: "EUR",
      isOpen: true
    },
    {
      id: "p9",
      name: "Energy Sector Equipment",
      description: "Specialized equipment for renewable energy applications.",
      designPicture: "https://picsum.photos/200/120?random=9",
      designFile: "/designs/energy_equip.dxf",
      customerId: "c3",
      pieceIds: ["pc13", "pc14"],
      progress: 40,
      opened: new Date("2025-08-08"),
      delivery: new Date("2025-10-15"),
      invoiceAmount: 42000,
      currency: "EUR",
      isOpen: true
    },
    {
      id: "p10",
      name: "Food Processing Machinery",
      description: "Stainless steel components for food processing equipment.",
      designPicture: "https://picsum.photos/200/120?random=10",
      designFile: "/designs/food_machinery.dxf",
      customerId: "c3",
      pieceIds: ["pc15"],
      progress: 80,
      opened: new Date("2025-07-10"),
      delivery: new Date("2025-08-28"),
      invoiceAmount: 16500,
      currency: "EUR",
      isOpen: true
    },
    {
      id: "p11",
      name: "Precision Tooling",
      description: "High-precision tooling for manufacturing applications.",
      designPicture: "https://picsum.photos/200/120?random=11",
      designFile: "/designs/precision_tooling.dxf",
      customerId: "c4",
      pieceIds: ["pc16", "pc17"],
      progress: 25,
      opened: new Date("2025-08-15"),
      delivery: new Date("2025-10-30"),
      invoiceAmount: 31000,
      currency: "EUR",
      isOpen: true
    },
    {
      id: "p12",
      name: "Defense Components",
      description: "Military-grade components with special certifications.",
      designPicture: "https://picsum.photos/200/120?random=12",
      designFile: "/designs/defense_comp.dxf",
      customerId: "c4",
      pieceIds: ["pc18"],
      progress: 60,
      opened: new Date("2025-07-28"),
      delivery: new Date("2025-09-12"),
      invoiceAmount: 25500,
      currency: "EUR",
      isOpen: true
    },
    {
      id: "p13",
      name: "Telecommunications Equipment",
      description: "Precision components for telecommunications infrastructure.",
      designPicture: "https://picsum.photos/200/120?random=13",
      designFile: "/designs/telecom_equip.dxf",
      customerId: "c5",
      pieceIds: ["pc19", "pc20"],
      progress: 35,
      opened: new Date("2025-08-18"),
      delivery: new Date("2025-10-22"),
      invoiceAmount: 19500,
      currency: "EUR",
      isOpen: true
    },
    {
      id: "p14",
      name: "Laboratory Equipment",
      description: "Specialized laboratory equipment with chemical resistance.",
      designPicture: "https://picsum.photos/200/120?random=14",
      designFile: "/designs/lab_equipment.dxf",
      customerId: "c5",
      pieceIds: ["pc21"],
      progress: 90,
      opened: new Date("2025-06-15"),
      delivery: new Date("2025-08-20"),
      invoiceAmount: 33500,
      currency: "EUR",
      isOpen: false
    },
    {
      id: "p15",
      name: "Oil & Gas Components",
      description: "High-pressure components for oil and gas industry.",
      designPicture: "https://picsum.photos/200/120?random=15",
      designFile: "/designs/oil_gas_comp.dxf",
      customerId: "c5",
      pieceIds: ["pc22", "pc23"],
      progress: 15,
      opened: new Date("2025-08-20"),
      delivery: new Date("2025-11-30"),
      invoiceAmount: 48000,
      currency: "EUR",
      isOpen: true
    }
  ];
  pieces: Piece[] =  [
    // Project p1 - CNC Machine Housing
    {
      id: "pc1",
      reference: "HSG-001",
      name: "Housing Base",
      description: "Base plate for CNC machine housing.",
      designFile: "/designs/housing_base.dxf",
      designPicture: "https://picsum.photos/200/120?random=1",
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
      name: "Housing Cover",
      description: "Top cover for CNC machine housing.",
      designFile: "/designs/housing_cover.dxf",
      designPicture: "https://picsum.photos/200/120?random=2",
      materialId: "m2",
      materialQuantity: 5,
      materialUnit: "kg",
      quantity: 10,
      progress: 50,
      status: "In Progress",
      taskIds: ["t3"]
    },
    // Project p2 - Robotic Arm
    {
      id: "pc3",
      reference: "RB-001",
      name: "Arm Joint",
      description: "Steel joint for robotic arm.",
      designFile: "/designs/arm_joint.dxf",
      designPicture: "https://picsum.photos/200/120?random=3",
      materialId: "m2",
      materialQuantity: 3,
      materialUnit: "kg",
      quantity: 15,
      progress: 10,
      status: "To Do",
      taskIds: ["t4"]
    },
    // Project p3 - Industrial Valve Assembly
    {
      id: "pc4",
      reference: "VLV-001",
      name: "Valve Body",
      description: "Main valve body casting.",
      designFile: "/designs/valve_body.dxf",
      designPicture: "https://picsum.photos/200/120?random=4",
      materialId: "m3",
      materialQuantity: 8,
      materialUnit: "kg",
      quantity: 10,
      progress: 85,
      status: "In Progress",
      taskIds: ["t5"]
    },
    {
      id: "pc5",
      reference: "VLV-002",
      name: "Valve Seat",
      description: "Precision valve seat component.",
      designFile: "/designs/valve_seat.dxf",
      designPicture: "https://picsum.photos/200/120?random=5",
      materialId: "m2",
      materialQuantity: 1,
      materialUnit: "kg",
      quantity: 10,
      progress: 90,
      status: "In Progress",
      taskIds: ["t6"]
    },
    // Project p4 - Automotive Bracket
    {
      id: "pc6",
      reference: "AUTO-001",
      name: "Suspension Bracket",
      description: "Custom suspension mounting bracket.",
      designFile: "/designs/suspension_bracket.dxf",
      designPicture: "https://picsum.photos/200/120?random=6",
      materialId: "m1",
      materialQuantity: 2,
      materialUnit: "kg",
      quantity: 50,
      progress: 45,
      status: "In Progress",
      taskIds: ["t7"]
    },
    // Project p5 - Aerospace Component
    {
      id: "pc7",
      reference: "AERO-001",
      name: "Wing Strut",
      description: "Aerospace wing support strut.",
      designFile: "/designs/wing_strut.dxf",
      designPicture: "https://picsum.photos/200/120?random=7",
      materialId: "m4",
      materialQuantity: 12,
      materialUnit: "kg",
      quantity: 8,
      progress: 30,
      status: "In Progress",
      taskIds: ["t8"]
    },
    {
      id: "pc8",
      reference: "AERO-002",
      name: "Control Surface Mount",
      description: "Control surface mounting hardware.",
      designFile: "/designs/control_mount.dxf",
      designPicture: "https://picsum.photos/200/120?random=8",
      materialId: "m4",
      materialQuantity: 6,
      materialUnit: "kg",
      quantity: 16,
      progress: 25,
      status: "To Do",
      taskIds: ["t9"]
    },
    // Project p6 - Marine Equipment
    {
      id: "pc9",
      reference: "MAR-001",
      name: "Marine Propeller Hub",
      description: "Corrosion-resistant propeller hub.",
      designFile: "/designs/prop_hub.dxf",
      designPicture: "https://picsum.photos/200/120?random=9",
      materialId: "m5",
      materialQuantity: 15,
      materialUnit: "kg",
      quantity: 4,
      progress: 70,
      status: "In Progress",
      taskIds: ["t10"]
    },
    // Project p7 - Medical Device Parts
    {
      id: "pc10",
      reference: "MED-001",
      name: "Surgical Tool Base",
      description: "Base component for surgical instruments.",
      designFile: "/designs/surgical_base.dxf",
      designPicture: "https://picsum.photos/200/120?random=10",
      materialId: "m6",
      materialQuantity: 0.5,
      materialUnit: "kg",
      quantity: 100,
      progress: 95,
      status: "Completed",
      taskIds: ["t11"]
    },
    {
      id: "pc11",
      reference: "MED-002",
      name: "Device Housing",
      description: "Medical device protective housing.",
      designFile: "/designs/device_housing.dxf",
      designPicture: "https://picsum.photos/200/120?random=11",
      materialId: "m6",
      materialQuantity: 1.2,
      materialUnit: "kg",
      quantity: 50,
      progress: 100,
      status: "Completed",
      taskIds: ["t12"]
    },
    // Project p8 - Construction Hardware
    {
      id: "pc12",
      reference: "CONS-001",
      name: "Heavy Duty Clamp",
      description: "Industrial construction clamp.",
      designFile: "/designs/heavy_clamp.dxf",
      designPicture: "https://picsum.photos/200/120?random=12",
      materialId: "m3",
      materialQuantity: 4,
      materialUnit: "kg",
      quantity: 25,
      progress: 55,
      status: "In Progress",
      taskIds: ["t13"]
    },
    // Project p9 - Energy Sector Equipment
    {
      id: "pc13",
      reference: "ENE-001",
      name: "Turbine Blade Mount",
      description: "Wind turbine blade mounting system.",
      designFile: "/designs/blade_mount.dxf",
      designPicture: "https://picsum.photos/200/120?random=13",
      materialId: "m7",
      materialQuantity: 20,
      materialUnit: "kg",
      quantity: 12,
      progress: 40,
      status: "In Progress",
      taskIds: ["t14"]
    },
    {
      id: "pc14",
      reference: "ENE-002",
      name: "Generator Housing",
      description: "Wind generator protective housing.",
      designFile: "/designs/gen_housing.dxf",
      designPicture: "https://picsum.photos/200/120?random=14",
      materialId: "m3",
      materialQuantity: 50,
      materialUnit: "kg",
      quantity: 3,
      progress: 35,
      status: "In Progress",
      taskIds: ["t15"]
    },
    // Project p10 - Food Processing Machinery
    {
      id: "pc15",
      reference: "FOOD-001",
      name: "Conveyor Component",
      description: "Stainless steel conveyor part.",
      designFile: "/designs/conveyor_comp.dxf",
      designPicture: "https://picsum.photos/200/120?random=15",
      materialId: "m5",
      materialQuantity: 3,
      materialUnit: "kg",
      quantity: 30,
      progress: 80,
      status: "In Progress",
      taskIds: ["t16"]
    },
    // Project p11 - Precision Tooling
    {
      id: "pc16",
      reference: "TOOL-001",
      name: "Cutting Tool Head",
      description: "Precision cutting tool component.",
      designFile: "/designs/cutting_head.dxf",
      designPicture: "https://picsum.photos/200/120?random=16",
      materialId: "m8",
      materialQuantity: 0.8,
      materialUnit: "kg",
      quantity: 15,
      progress: 25,
      status: "To Do",
      taskIds: ["t17"]
    },
    {
      id: "pc17",
      reference: "TOOL-002",
      name: "Tool Handle",
      description: "Ergonomic tool handle design.",
      designFile: "/designs/tool_handle.dxf",
      designPicture: "https://picsum.photos/200/120?random=17",
      materialId: "m1",
      materialQuantity: 0.5,
      materialUnit: "kg",
      quantity: 15,
      progress: 20,
      status: "To Do",
      taskIds: ["t18"]
    },
    // Project p12 - Defense Components
    {
      id: "pc18",
      reference: "DEF-001",
      name: "Armor Plate",
      description: "Military vehicle armor component.",
      designFile: "/designs/armor_plate.dxf",
      designPicture: "https://picsum.photos/200/120?random=18",
      materialId: "m9",
      materialQuantity: 25,
      materialUnit: "kg",
      quantity: 20,
      progress: 60,
      status: "In Progress",
      taskIds: ["t19"]
    },
    // Project p13 - Telecommunications Equipment
    {
      id: "pc19",
      reference: "TEL-001",
      name: "Antenna Mount",
      description: "Precision antenna mounting system.",
      designFile: "/designs/antenna_mount.dxf",
      designPicture: "https://picsum.photos/200/120?random=19",
      materialId: "m1",
      materialQuantity: 1.5,
      materialUnit: "kg",
      quantity: 40,
      progress: 35,
      status: "In Progress",
      taskIds: ["t20"]
    },
    {
      id: "pc20",
      reference: "TEL-002",
      name: "Signal Housing",
      description: "RF signal processing housing.",
      designFile: "/designs/signal_housing.dxf",
      designPicture: "https://picsum.photos/200/120?random=20",
      materialId: "m2",
      materialQuantity: 2.5,
      materialUnit: "kg",
      quantity: 20,
      progress: 30,
      status: "In Progress",
      taskIds: ["t21"]
    },
    // Project p14 - Laboratory Equipment
    {
      id: "pc21",
      reference: "LAB-001",
      name: "Chemical Resistant Vessel",
      description: "Laboratory reaction vessel.",
      designFile: "/designs/chem_vessel.dxf",
      designPicture: "https://picsum.photos/200/120?random=21",
      materialId: "m10",
      materialQuantity: 8,
      materialUnit: "kg",
      quantity: 12,
      progress: 90,
      status: "In Progress",
      taskIds: ["t22"]
    },
    // Project p15 - Oil & Gas Components
    {
      id: "pc22",
      reference: "OIL-001",
      name: "Pressure Valve",
      description: "High-pressure safety valve.",
      designFile: "/designs/pressure_valve.dxf",
      designPicture: "https://picsum.photos/200/120?random=22",
      materialId: "m11",
      materialQuantity: 18,
      materialUnit: "kg",
      quantity: 6,
      progress: 15,
      status: "To Do",
      taskIds: ["t23"]
    },
    {
      id: "pc23",
      reference: "OIL-002",
      name: "Pipeline Connector",
      description: "Heavy-duty pipeline connection.",
      designFile: "/designs/pipeline_conn.dxf",
      designPicture: "https://picsum.photos/200/120?random=23",
      materialId: "m11",
      materialQuantity: 5,
      materialUnit: "kg",
      quantity: 24,
      progress: 10,
      status: "To Do",
      taskIds: ["t24"]
    }
  ];
  resources: Resource[] =  [
    { id: "r1", name: "CNC Operator", type: "Person", taskIds: ["t1", "t2", "t4", "t9", "t12", "t15", "t21"] },
    { id: "r2", name: "Lathe Machine", type: "Machine", taskIds: ["t1", "t3", "t6", "t10", "t16", "t20", "t24"] },
    { id: "r3", name: "Welder", type: "Person", taskIds: ["t7", "t14", "t15", "t18"] },
    { id: "r4", name: "Forging Press", type: "Machine", taskIds: ["t5", "t13", "t19", "t23"] },
    { id: "r5", name: "Precision Machinist", type: "Person", taskIds: ["t8", "t11", "t17", "t23"] },
    { id: "r6", name: "Assembly Technician", type: "Person", taskIds: ["t10", "t14", "t19", "t22"] }
  ];
  tasks: Task[] = [
    // Project p1 - CNC Machine Housing
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
      name: "Machine Housing Cover",
      description: "Machine the housing cover to specifications.",
      estimatedTime: 6,
      spentTime: 2,
      quantity: 10,
      progress: 50,
      status: "In Progress",
      resourceIds: ["r2"],
      commentIds: ["cm2"],
      dueDate: new Date("2025-09-05"),
      actualFinishDate: undefined,
      createdBy: "r1",
      creationDate: new Date("2025-08-18")
    },
    // Project p2 - Robotic Arm
    {
      id: "t4",
      name: "Polish Joint",
      description: "Surface finishing for robotic arm joint.",
      estimatedTime: 4,
      spentTime: 0,
      quantity: 15,
      progress: 10,
      status: "To Do",
      resourceIds: ["r1"],
      commentIds: [],
      dueDate: new Date("2025-09-10"),
      actualFinishDate: undefined,
      createdBy: "r1",
      creationDate: new Date("2025-08-20")
    },
    // Project p3 - Industrial Valve Assembly
    {
      id: "t5",
      name: "Cast Valve Body",
      description: "Cast the main valve body component.",
      estimatedTime: 8,
      spentTime: 7,
      quantity: 10,
      progress: 85,
      status: "In Progress",
      resourceIds: ["r4"],
      commentIds: [],
      dueDate: new Date("2025-08-30"),
      actualFinishDate: undefined,
      createdBy: "r1",
      creationDate: new Date("2025-07-20")
    },
    {
      id: "t6",
      name: "Machine Valve Seat",
      description: "Precision machining of valve seat.",
      estimatedTime: 4,
      spentTime: 3.5,
      quantity: 10,
      progress: 90,
      status: "In Progress",
      resourceIds: ["r2"],
      commentIds: [],
      dueDate: new Date("2025-08-28"),
      actualFinishDate: undefined,
      createdBy: "r1",
      creationDate: new Date("2025-07-25")
    },
    // Project p4 - Automotive Bracket
    {
      id: "t7",
      name: "Fabricate Bracket",
      description: "Fabricate suspension mounting bracket.",
      estimatedTime: 3,
      spentTime: 1.5,
      quantity: 50,
      progress: 45,
      status: "In Progress",
      resourceIds: ["r3"],
      commentIds: [],
      dueDate: new Date("2025-09-15"),
      actualFinishDate: undefined,
      createdBy: "r1",
      creationDate: new Date("2025-08-10")
    },
    // Project p5 - Aerospace Component
    {
      id: "t8",
      name: "Machine Wing Strut",
      description: "Precision machining of aerospace wing strut.",
      estimatedTime: 12,
      spentTime: 4,
      quantity: 8,
      progress: 30,
      status: "In Progress",
      resourceIds: ["r5"],
      commentIds: [],
      dueDate: new Date("2025-10-15"),
      actualFinishDate: undefined,
      createdBy: "r1",
      creationDate: new Date("2025-08-15")
    },
    {
      id: "t9",
      name: "Assemble Control Mount",
      description: "Assembly of control surface mounting hardware.",
      estimatedTime: 6,
      spentTime: 1,
      quantity: 16,
      progress: 25,
      status: "To Do",
      resourceIds: ["r1"],
      commentIds: [],
      dueDate: new Date("2025-10-20"),
      actualFinishDate: undefined,
      createdBy: "r1",
      creationDate: new Date("2025-08-18")
    },
    // Project p6 - Marine Equipment
    {
      id: "t10",
      name: "Machine Propeller Hub",
      description: "Machine marine propeller hub with corrosion resistance.",
      estimatedTime: 10,
      spentTime: 7,
      quantity: 4,
      progress: 70,
      status: "In Progress",
      resourceIds: ["r2", "r6"],
      commentIds: [],
      dueDate: new Date("2025-09-01"),
      actualFinishDate: undefined,
      createdBy: "r1",
      creationDate: new Date("2025-07-30")
    },
    // Project p7 - Medical Device Parts
    {
      id: "t11",
      name: "Machine Surgical Base",
      description: "Precision machining of surgical tool base.",
      estimatedTime: 2,
      spentTime: 1.9,
      quantity: 100,
      progress: 95,
      status: "In Progress",
      resourceIds: ["r5"],
      commentIds: [],
      dueDate: new Date("2025-08-22"),
      actualFinishDate: undefined,
      createdBy: "r1",
      creationDate: new Date("2025-06-25")
    },
    {
      id: "t12",
      name: "Assemble Device Housing",
      description: "Assembly of medical device housing.",
      estimatedTime: 4,
      spentTime: 4,
      quantity: 50,
      progress: 100,
      status: "Completed",
      resourceIds: ["r1"],
      commentIds: [],
      dueDate: new Date("2025-08-20"),
      actualFinishDate: new Date("2025-08-19"),
      createdBy: "r1",
      creationDate: new Date("2025-07-01")
    },
    // Project p8 - Construction Hardware
    {
      id: "t13",
      name: "Forge Heavy Clamp",
      description: "Forging of heavy-duty construction clamp.",
      estimatedTime: 8,
      spentTime: 4.5,
      quantity: 25,
      progress: 55,
      status: "In Progress",
      resourceIds: ["r4"],
      commentIds: [],
      dueDate: new Date("2025-09-20"),
      actualFinishDate: undefined,
      createdBy: "r1",
      creationDate: new Date("2025-08-05")
    },
    // Project p9 - Energy Sector Equipment
    {
      id: "t14",
      name: "Fabricate Blade Mount",
      description: "Fabricate wind turbine blade mounting system.",
      estimatedTime: 15,
      spentTime: 6,
      quantity: 12,
      progress: 40,
      status: "In Progress",
      resourceIds: ["r3", "r6"],
      commentIds: [],
      dueDate: new Date("2025-10-05"),
      actualFinishDate: undefined,
      createdBy: "r1",
      creationDate: new Date("2025-08-12")
    },
    {
      id: "t15",
      name: "Assemble Generator Housing",
      description: "Assembly of wind generator housing.",
      estimatedTime: 20,
      spentTime: 7,
      quantity: 3,
      progress: 35,
      status: "In Progress",
      resourceIds: ["r1", "r3"],
      commentIds: [],
      dueDate: new Date("2025-10-10"),
      actualFinishDate: undefined,
      createdBy: "r1",
      creationDate: new Date("2025-08-14")
    },
    // Project p10 - Food Processing Machinery
    {
      id: "t16",
      name: "Machine Conveyor Component",
      description: "Machine stainless steel conveyor component.",
      estimatedTime: 5,
      spentTime: 4,
      quantity: 30,
      progress: 80,
      status: "In Progress",
      resourceIds: ["r2"],
      commentIds: [],
      dueDate: new Date("2025-08-25"),
      actualFinishDate: undefined,
      createdBy: "r1",
      creationDate: new Date("2025-07-15")
    },
    // Project p11 - Precision Tooling
    {
      id: "t17",
      name: "Machine Cutting Head",
      description: "Precision machining of cutting tool head.",
      estimatedTime: 8,
      spentTime: 2,
      quantity: 15,
      progress: 25,
      status: "In Progress",
      resourceIds: ["r5"],
      commentIds: [],
      dueDate: new Date("2025-10-25"),
      actualFinishDate: undefined,
      createdBy: "r1",
      creationDate: new Date("2025-08-20")
    },
    {
      id: "t18",
      name: "Fabricate Tool Handle",
      description: "Fabricate ergonomic tool handle.",
      estimatedTime: 3,
      spentTime: 0.5,
      quantity: 15,
      progress: 20,
      status: "To Do",
      resourceIds: ["r3"],
      commentIds: [],
      dueDate: new Date("2025-10-28"),
      actualFinishDate: undefined,
      createdBy: "r1",
      creationDate: new Date("2025-08-22")
    },
    // Project p12 - Defense Components
    {
      id: "t19",
      name: "Fabricate Armor Plate",
      description: "Fabricate military vehicle armor plate.",
      estimatedTime: 12,
      spentTime: 7,
      quantity: 20,
      progress: 60,
      status: "In Progress",
      resourceIds: ["r4", "r6"],
      commentIds: [],
      dueDate: new Date("2025-09-10"),
      actualFinishDate: undefined,
      createdBy: "r1",
      creationDate: new Date("2025-08-01")
    },
    // Project p13 - Telecommunications Equipment
    {
      id: "t20",
      name: "Machine Antenna Mount",
      description: "Precision machining of antenna mounting system.",
      estimatedTime: 4,
      spentTime: 1.5,
      quantity: 40,
      progress: 35,
      status: "In Progress",
      resourceIds: ["r2"],
      commentIds: [],
      dueDate: new Date("2025-10-15"),
      actualFinishDate: undefined,
      createdBy: "r1",
      creationDate: new Date("2025-08-20")
    },
    {
      id: "t21",
      name: "Assemble Signal Housing",
      description: "Assembly of RF signal processing housing.",
      estimatedTime: 6,
      spentTime: 2,
      quantity: 20,
      progress: 30,
      status: "In Progress",
      resourceIds: ["r1"],
      commentIds: [],
      dueDate: new Date("2025-10-18"),
      actualFinishDate: undefined,
      createdBy: "r1",
      creationDate: new Date("2025-08-22")
    },
    // Project p14 - Laboratory Equipment
    {
      id: "t22",
      name: "Fabricate Chemical Vessel",
      description: "Fabricate chemical-resistant laboratory vessel.",
      estimatedTime: 10,
      spentTime: 9,
      quantity: 12,
      progress: 90,
      status: "In Progress",
      resourceIds: ["r6"],
      commentIds: [],
      dueDate: new Date("2025-08-18"),
      actualFinishDate: undefined,
      createdBy: "r1",
      creationDate: new Date("2025-06-20")
    },
    // Project p15 - Oil & Gas Components
    {
      id: "t23",
      name: "Fabricate Pressure Valve",
      description: "Fabricate high-pressure safety valve.",
      estimatedTime: 16,
      spentTime: 2.5,
      quantity: 6,
      progress: 15,
      status: "To Do",
      resourceIds: ["r4", "r5"],
      commentIds: [],
      dueDate: new Date("2025-11-15"),
      actualFinishDate: undefined,
      createdBy: "r1",
      creationDate: new Date("2025-08-25")
    },
    {
      id: "t24",
      name: "Machine Pipeline Connector",
      description: "Machine heavy-duty pipeline connection.",
      estimatedTime: 8,
      spentTime: 1,
      quantity: 24,
      progress: 10,
      status: "To Do",
      resourceIds: ["r2"],
      commentIds: [],
      dueDate: new Date("2025-11-20"),
      actualFinishDate: undefined,
      createdBy: "r1",
      creationDate: new Date("2025-08-27")
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
