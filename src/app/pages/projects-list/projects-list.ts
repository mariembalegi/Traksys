import { Component ,inject} from '@angular/core';
import {Customer} from '../../models/customer';
import {NgSelectComponent} from '@ng-select/ng-select';
import {DatePipe, NgForOf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Project} from '../../models/project';
import {Paginator} from '../../components/paginator/paginator';
import {Dialog} from '@angular/cdk/dialog';
import {AddEditProjectModal} from '../../components/add-edit-project-modal/add-edit-project-modal';
import {RouterLink} from '@angular/router';
import {Material} from '../../models/material';


@Component({
  selector: 'app-projects-list',
  imports: [
    DatePipe,
    FormsModule,
    NgForOf,
    NgSelectComponent,
    Paginator,
    RouterLink
  ],
  templateUrl: './projects-list.html',
  styleUrl: './projects-list.scss'
})
export class ProjectsList {
  private dialog=inject(Dialog);
  projects: Project[] = [];
  materials: Material[] = [];
  filteredProjects: Project[] = [];
  customers: Customer[] = [];
  filterStatus: 'all' | 'open' | 'closed' = 'all';
  searchText: string = '';
  selectedCustomer: string | null = null;
  isFilterDropdownOpen = false;

  pagedProjects: Project[] = [];
  itemsPerPage = 50;

  onPageChange(currentPageItems: Project[]) {
    this.pagedProjects = currentPageItems;
  }

  ngOnInit() {
    this.loadOnData()
  }
  loadOnData() {

    this.customers = [
      { id: "c1", name: "ACME Industries", projectIds: ["p1", "p3", "p5", "p7"] },
      { id: "c2", name: "TechnoFab", projectIds: ["p2", "p4", "p6"] },
      { id: "c3", name: "MetalWorks Inc", projectIds: ["p8", "p9", "p10"] },
      { id: "c4", name: "Precision Engineering", projectIds: ["p11", "p12"] },
      { id: "c5", name: "Industrial Solutions", projectIds: ["p13", "p14", "p15"] }
    ];

    this.projects = [
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
      },
      // Additional test projects to demonstrate pagination
      {
        id: "p16",
        name: "Mining Equipment Parts",
        description: "Heavy-duty mining equipment components.",
        designPicture: "https://picsum.photos/200/120?random=16",
        designFile: "/designs/mining_equip.dxf",
        customerId: "c1",
        pieceIds: ["pc24"],
        progress: 45,
        opened: new Date("2025-08-22"),
        delivery: new Date("2025-11-15"),
        invoiceAmount: 52000,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p17",
        name: "Pharmaceutical Equipment",
        description: "Sterile equipment for pharmaceutical manufacturing.",
        designPicture: "https://picsum.photos/200/120?random=17",
        designFile: "/designs/pharma_equip.dxf",
        customerId: "c2",
        pieceIds: ["pc25", "pc26"],
        progress: 20,
        opened: new Date("2025-08-25"),
        delivery: new Date("2025-12-01"),
        invoiceAmount: 38000,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p18",
        name: "Railway Components",
        description: "Safety-critical railway system components.",
        designPicture: "https://picsum.photos/200/120?random=18",
        designFile: "/designs/railway_comp.dxf",
        customerId: "c3",
        pieceIds: ["pc27"],
        progress: 75,
        opened: new Date("2025-07-30"),
        delivery: new Date("2025-09-25"),
        invoiceAmount: 29500,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p19",
        name: "Textile Machinery",
        description: "Precision parts for textile manufacturing equipment.",
        designPicture: "https://picsum.photos/200/120?random=19",
        designFile: "/designs/textile_machinery.dxf",
        customerId: "c4",
        pieceIds: ["pc28", "pc29"],
        progress: 60,
        opened: new Date("2025-08-05"),
        delivery: new Date("2025-10-10"),
        invoiceAmount: 21000,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p20",
        name: "Chemical Processing Equipment",
        description: "Corrosion-resistant chemical processing components.",
        designPicture: "https://picsum.photos/200/120?random=20",
        designFile: "/designs/chemical_proc.dxf",
        customerId: "c5",
        pieceIds: ["pc30"],
        progress: 35,
        opened: new Date("2025-08-12"),
        delivery: new Date("2025-11-05"),
        invoiceAmount: 44500,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p21",
        name: "Water Treatment System",
        description: "Components for municipal water treatment facilities.",
        designPicture: "https://picsum.photos/200/120?random=21",
        designFile: "/designs/water_treatment.dxf",
        customerId: "c1",
        pieceIds: ["pc31", "pc32"],
        progress: 80,
        opened: new Date("2025-07-20"),
        delivery: new Date("2025-09-10"),
        invoiceAmount: 33000,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p22",
        name: "Solar Panel Mounting",
        description: "Aluminum mounting systems for solar installations.",
        designPicture: "https://picsum.photos/200/120?random=22",
        designFile: "/designs/solar_mounting.dxf",
        customerId: "c2",
        pieceIds: ["pc33"],
        progress: 50,
        opened: new Date("2025-08-08"),
        delivery: new Date("2025-10-20"),
        invoiceAmount: 18000,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p23",
        name: "Packaging Machinery",
        description: "High-speed packaging equipment components.",
        designPicture: "https://picsum.photos/200/120?random=23",
        designFile: "/designs/packaging_mach.dxf",
        customerId: "c3",
        pieceIds: ["pc34", "pc35"],
        progress: 25,
        opened: new Date("2025-08-15"),
        delivery: new Date("2025-11-25"),
        invoiceAmount: 26500,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p24",
        name: "Electronic Enclosures",
        description: "Custom electronic equipment enclosures.",
        designPicture: "https://picsum.photos/200/120?random=24",
        designFile: "/designs/electronic_encl.dxf",
        customerId: "c4",
        pieceIds: ["pc36"],
        progress: 40,
        opened: new Date("2025-08-18"),
        delivery: new Date("2025-10-15"),
        invoiceAmount: 14500,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p25",
        name: "HVAC Components",
        description: "Heating, ventilation, and air conditioning parts.",
        designPicture: "https://picsum.photos/200/120?random=25",
        designFile: "/designs/hvac_comp.dxf",
        customerId: "c5",
        pieceIds: ["pc37", "pc38"],
        progress: 65,
        opened: new Date("2025-08-01"),
        delivery: new Date("2025-09-30"),
        invoiceAmount: 22500,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p26",
        name: "Wind Turbine Parts",
        description: "Large-scale wind turbine component fabrication.",
        designPicture: "https://picsum.photos/200/120?random=26",
        designFile: "/designs/wind_turbine.dxf",
        customerId: "c1",
        pieceIds: ["pc39"],
        progress: 30,
        opened: new Date("2025-08-20"),
        delivery: new Date("2025-12-15"),
        invoiceAmount: 85000,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p27",
        name: "Security Equipment",
        description: "Physical security equipment manufacturing.",
        designPicture: "https://picsum.photos/200/120?random=27",
        designFile: "/designs/security_equip.dxf",
        customerId: "c2",
        pieceIds: ["pc40", "pc41"],
        progress: 55,
        opened: new Date("2025-08-10"),
        delivery: new Date("2025-10-05"),
        invoiceAmount: 19500,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p28",
        name: "Fire Safety Systems",
        description: "Fire suppression system components.",
        designPicture: "https://picsum.photos/200/120?random=28",
        designFile: "/designs/fire_safety.dxf",
        customerId: "c3",
        pieceIds: ["pc42"],
        progress: 70,
        opened: new Date("2025-07-25"),
        delivery: new Date("2025-09-20"),
        invoiceAmount: 31500,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p29",
        name: "Sports Equipment",
        description: "Professional sports equipment manufacturing.",
        designPicture: "https://picsum.photos/200/120?random=29",
        designFile: "/designs/sports_equip.dxf",
        customerId: "c4",
        pieceIds: ["pc43", "pc44"],
        progress: 85,
        opened: new Date("2025-06-30"),
        delivery: new Date("2025-08-31"),
        invoiceAmount: 16000,
        currency: "EUR",
        isOpen: false
      },
      {
        id: "p30",
        name: "Furniture Hardware",
        description: "High-end furniture hardware components.",
        designPicture: "https://picsum.photos/200/120?random=30",
        designFile: "/designs/furniture_hw.dxf",
        customerId: "c5",
        pieceIds: ["pc45"],
        progress: 90,
        opened: new Date("2025-07-05"),
        delivery: new Date("2025-08-25"),
        invoiceAmount: 12500,
        currency: "EUR",
        isOpen: false
      },
      {
        id: "p31",
        name: "Appliance Components",
        description: "Home appliance manufacturing parts.",
        designPicture: "https://picsum.photos/200/120?random=31",
        designFile: "/designs/appliance_comp.dxf",
        customerId: "c1",
        pieceIds: ["pc46", "pc47"],
        progress: 45,
        opened: new Date("2025-08-14"),
        delivery: new Date("2025-10-28"),
        invoiceAmount: 24000,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p32",
        name: "Lighting Fixtures",
        description: "Custom architectural lighting components.",
        designPicture: "https://picsum.photos/200/120?random=32",
        designFile: "/designs/lighting_fix.dxf",
        customerId: "c2",
        pieceIds: ["pc48"],
        progress: 60,
        opened: new Date("2025-08-06"),
        delivery: new Date("2025-10-12"),
        invoiceAmount: 17500,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p33",
        name: "Playground Equipment",
        description: "Safe and durable playground equipment parts.",
        designPicture: "https://picsum.photos/200/120?random=33",
        designFile: "/designs/playground_equip.dxf",
        customerId: "c3",
        pieceIds: ["pc49", "pc50"],
        progress: 35,
        opened: new Date("2025-08-16"),
        delivery: new Date("2025-11-08"),
        invoiceAmount: 28500,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p34",
        name: "Boat Hardware",
        description: "Marine-grade boat hardware and fittings.",
        designPicture: "https://picsum.photos/200/120?random=34",
        designFile: "/designs/boat_hardware.dxf",
        customerId: "c4",
        pieceIds: ["pc51"],
        progress: 75,
        opened: new Date("2025-07-28"),
        delivery: new Date("2025-09-15"),
        invoiceAmount: 20500,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p35",
        name: "Display Stands",
        description: "Commercial display and exhibition stands.",
        designPicture: "https://picsum.photos/200/120?random=35",
        designFile: "/designs/display_stands.dxf",
        customerId: "c5",
        pieceIds: ["pc52", "pc53"],
        progress: 50,
        opened: new Date("2025-08-11"),
        delivery: new Date("2025-10-25"),
        invoiceAmount: 15500,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p36",
        name: "Agricultural Equipment",
        description: "Farm equipment and machinery components.",
        designPicture: "https://picsum.photos/200/120?random=36",
        designFile: "/designs/agri_equip.dxf",
        customerId: "c1",
        pieceIds: ["pc54"],
        progress: 40,
        opened: new Date("2025-08-19"),
        delivery: new Date("2025-11-12"),
        invoiceAmount: 39000,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p37",
        name: "Storage Solutions",
        description: "Industrial storage and shelving systems.",
        designPicture: "https://picsum.photos/200/120?random=37",
        designFile: "/designs/storage_sol.dxf",
        customerId: "c2",
        pieceIds: ["pc55", "pc56"],
        progress: 25,
        opened: new Date("2025-08-21"),
        delivery: new Date("2025-11-20"),
        invoiceAmount: 27500,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p38",
        name: "Exercise Equipment",
        description: "Commercial gym equipment manufacturing.",
        designPicture: "https://picsum.photos/200/120?random=38",
        designFile: "/designs/exercise_equip.dxf",
        customerId: "c3",
        pieceIds: ["pc57"],
        progress: 80,
        opened: new Date("2025-07-15"),
        delivery: new Date("2025-09-08"),
        invoiceAmount: 34500,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p39",
        name: "Bicycle Components",
        description: "High-performance bicycle frame and components.",
        designPicture: "https://picsum.photos/200/120?random=39",
        designFile: "/designs/bicycle_comp.dxf",
        customerId: "c4",
        pieceIds: ["pc58", "pc59"],
        progress: 65,
        opened: new Date("2025-08-02"),
        delivery: new Date("2025-09-28"),
        invoiceAmount: 18500,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p40",
        name: "Kitchen Equipment",
        description: "Commercial kitchen equipment parts.",
        designPicture: "https://picsum.photos/200/120?random=40",
        designFile: "/designs/kitchen_equip.dxf",
        customerId: "c5",
        pieceIds: ["pc60"],
        progress: 55,
        opened: new Date("2025-08-07"),
        delivery: new Date("2025-10-18"),
        invoiceAmount: 23000,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p41",
        name: "Solar Equipment",
        description: "Solar energy system components and brackets.",
        designPicture: "https://picsum.photos/200/120?random=41",
        designFile: "/designs/solar_equip.dxf",
        customerId: "c1",
        pieceIds: ["pc61", "pc62"],
        progress: 30,
        opened: new Date("2025-08-23"),
        delivery: new Date("2025-12-05"),
        invoiceAmount: 41000,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p42",
        name: "Waste Management",
        description: "Waste processing and recycling equipment.",
        designPicture: "https://picsum.photos/200/120?random=42",
        designFile: "/designs/waste_mgmt.dxf",
        customerId: "c2",
        pieceIds: ["pc63"],
        progress: 70,
        opened: new Date("2025-07-22"),
        delivery: new Date("2025-09-18"),
        invoiceAmount: 36500,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p43",
        name: "Crane Components",
        description: "Heavy-duty crane and lifting equipment parts.",
        designPicture: "https://picsum.photos/200/120?random=43",
        designFile: "/designs/crane_comp.dxf",
        customerId: "c3",
        pieceIds: ["pc64", "pc65"],
        progress: 45,
        opened: new Date("2025-08-13"),
        delivery: new Date("2025-11-01"),
        invoiceAmount: 67000,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p44",
        name: "Pump Systems",
        description: "Industrial pump components and assemblies.",
        designPicture: "https://picsum.photos/200/120?random=44",
        designFile: "/designs/pump_systems.dxf",
        customerId: "c4",
        pieceIds: ["pc66"],
        progress: 60,
        opened: new Date("2025-08-04"),
        delivery: new Date("2025-10-08"),
        invoiceAmount: 29000,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p45",
        name: "Conveyor Systems",
        description: "Material handling conveyor components.",
        designPicture: "https://picsum.photos/200/120?random=45",
        designFile: "/designs/conveyor_sys.dxf",
        customerId: "c5",
        pieceIds: ["pc67", "pc68"],
        progress: 85,
        opened: new Date("2025-07-01"),
        delivery: new Date("2025-08-29"),
        invoiceAmount: 45500,
        currency: "EUR",
        isOpen: false
      },
      {
        id: "p46",
        name: "Ventilation Systems",
        description: "Industrial ventilation and exhaust components.",
        designPicture: "https://picsum.photos/200/120?random=46",
        designFile: "/designs/ventilation_sys.dxf",
        customerId: "c1",
        pieceIds: ["pc69"],
        progress: 35,
        opened: new Date("2025-08-17"),
        delivery: new Date("2025-11-15"),
        invoiceAmount: 32000,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p47",
        name: "Printing Equipment",
        description: "Commercial printing machinery components.",
        designPicture: "https://picsum.photos/200/120?random=47",
        designFile: "/designs/printing_equip.dxf",
        customerId: "c2",
        pieceIds: ["pc70", "pc71"],
        progress: 75,
        opened: new Date("2025-07-26"),
        delivery: new Date("2025-09-22"),
        invoiceAmount: 25500,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p48",
        name: "Power Generation",
        description: "Electrical power generation equipment parts.",
        designPicture: "https://picsum.photos/200/120?random=48",
        designFile: "/designs/power_gen.dxf",
        customerId: "c3",
        pieceIds: ["pc72"],
        progress: 50,
        opened: new Date("2025-08-09"),
        delivery: new Date("2025-10-30"),
        invoiceAmount: 58000,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p49",
        name: "Audio Equipment",
        description: "Professional audio system components.",
        designPicture: "https://picsum.photos/200/120?random=49",
        designFile: "/designs/audio_equip.dxf",
        customerId: "c4",
        pieceIds: ["pc73", "pc74"],
        progress: 40,
        opened: new Date("2025-08-24"),
        delivery: new Date("2025-11-03"),
        invoiceAmount: 21500,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p50",
        name: "Test Equipment",
        description: "Laboratory and industrial testing equipment.",
        designPicture: "https://picsum.photos/200/120?random=50",
        designFile: "/designs/test_equip.dxf",
        customerId: "c5",
        pieceIds: ["pc75"],
        progress: 65,
        opened: new Date("2025-08-03"),
        delivery: new Date("2025-10-14"),
        invoiceAmount: 37500,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p51",
        name: "Climate Control",
        description: "Advanced climate control system components.",
        designPicture: "https://picsum.photos/200/120?random=51",
        designFile: "/designs/climate_control.dxf",
        customerId: "c1",
        pieceIds: ["pc76", "pc77"],
        progress: 20,
        opened: new Date("2025-08-26"),
        delivery: new Date("2025-12-10"),
        invoiceAmount: 43500,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p52",
        name: "Gaming Equipment",
        description: "Commercial gaming and entertainment equipment.",
        designPicture: "https://picsum.photos/200/120?random=52",
        designFile: "/designs/gaming_equip.dxf",
        customerId: "c2",
        pieceIds: ["pc78"],
        progress: 80,
        opened: new Date("2025-07-12"),
        delivery: new Date("2025-09-05"),
        invoiceAmount: 19000,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p53",
        name: "Robotics Platform",
        description: "Advanced robotics platform components.",
        designPicture: "https://picsum.photos/200/120?random=53",
        designFile: "/designs/robotics_platform.dxf",
        customerId: "c3",
        pieceIds: ["pc79", "pc80"],
        progress: 55,
        opened: new Date("2025-08-01"),
        delivery: new Date("2025-10-22"),
        invoiceAmount: 62000,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p54",
        name: "Sensor Housing",
        description: "Protective housing for industrial sensors.",
        designPicture: "https://picsum.photos/200/120?random=54",
        designFile: "/designs/sensor_housing.dxf",
        customerId: "c4",
        pieceIds: ["pc81"],
        progress: 70,
        opened: new Date("2025-07-29"),
        delivery: new Date("2025-09-25"),
        invoiceAmount: 16500,
        currency: "EUR",
        isOpen: true
      },
      {
        id: "p55",
        name: "Drone Components",
        description: "Commercial drone frame and component manufacturing.",
        designPicture: "https://picsum.photos/200/120?random=55",
        designFile: "/designs/drone_comp.dxf",
        customerId: "c5",
        pieceIds: ["pc82", "pc83"],
        progress: 45,
        opened: new Date("2025-08-15"),
        delivery: new Date("2025-11-07"),
        invoiceAmount: 28000,
        currency: "EUR",
        isOpen: true
      }
    ];

    this.materials = [
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


    this.applyFilters();
  }

  protected addEditModal() {
    this.dialog.open(AddEditProjectModal,{disableClose: true});
  }

  applyFilters() {
    this.filteredProjects = this.projects.filter(project => {
      const matchesStatus =
        this.filterStatus === 'all' ||
        (this.filterStatus === 'open' && project.isOpen) ||
        (this.filterStatus === 'closed' && !project.isOpen);
      const matchesSearch = !this.searchText || project.name.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesCustomer = !this.selectedCustomer || project.customerId === this.selectedCustomer;
      return matchesStatus && matchesSearch && matchesCustomer;
    });
    // Initialize pagedProjects with first page if filteredProjects is not empty
    if (this.filteredProjects.length > 0) {
      this.pagedProjects = this.filteredProjects.slice(0, this.itemsPerPage);
    } else {
      this.pagedProjects = [];
    }
  }


  formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  toggleFilterStatus() {
    this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
  }

  setFilterStatus(status: 'all' | 'open' | 'closed') {
    this.filterStatus = status;
    this.isFilterDropdownOpen = false;
    this.applyFilters();
  }

  getFilterStatusLabel(): string {
    switch (this.filterStatus) {
      case 'all': return 'All';
      case 'open': return 'Open';
      case 'closed': return 'Closed';
      default: return 'All';
    }
  }

  deleteProject(index: number) {
    // Get the actual project from pagedProjects (what's currently displayed)
    const projectToDelete = this.pagedProjects[index];

    // Remove from main projects array
    const mainIndex = this.projects.findIndex(p => p.id === projectToDelete.id);
    if (mainIndex > -1) {
      this.projects.splice(mainIndex, 1);
    }

    // Reapply filters and pagination
    this.applyFilters();
  }

  getCustomerName(customerId: string): string {
    const customer = this.customers.find(c => c.id === customerId);
    return customer ? customer.name : customerId;
  }
}
