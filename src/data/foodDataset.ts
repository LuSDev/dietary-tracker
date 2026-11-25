import { CustomDish, FoodItem } from '../domain/types';

export const INITIAL_FOOD_DATASET: FoodItem[] = [
  // =========================================================================
  // PROTEÍNAS: CARNES, AVES, PESCADOS Y PROTEÍNAS VEGETALES (28 ítems)
  // =========================================================================
  {
    id: 'chicken_breast',
    name: 'Pechuga de pollo (cruda)',
    category: 'proteins',
    per100g: { calories: 120, protein: 22.5, carbs: 0, fat: 2.6 },
    defaultPortionGrams: 150,
    portionLabel: '1 filete mediano (150g)'
  },
  {
    id: 'chicken_breast_cooked',
    name: 'Pechuga de pollo a la plancha',
    category: 'proteins',
    per100g: { calories: 165, protein: 31.0, carbs: 0, fat: 3.6 },
    defaultPortionGrams: 150,
    portionLabel: '1 pechuga cocida (150g)'
  },
  {
    id: 'chicken_thigh',
    name: 'Muslo de pollo sin piel',
    category: 'proteins',
    per100g: { calories: 179, protein: 24.8, carbs: 0, fat: 8.2 },
    defaultPortionGrams: 130,
    portionLabel: '1 muslo (130g)'
  },
  {
    id: 'turkey_breast',
    name: 'Pechuga de pavo',
    category: 'proteins',
    per100g: { calories: 135, protein: 29.0, carbs: 0, fat: 1.5 },
    defaultPortionGrams: 120,
    portionLabel: '1 porción (120g)'
  },
  {
    id: 'beef_lean',
    name: 'Carne vacuna magra (nalga / lomo)',
    category: 'proteins',
    per100g: { calories: 143, protein: 21.8, carbs: 0, fat: 5.8 },
    defaultPortionGrams: 160,
    portionLabel: '1 bife mediano (160g)'
  },
  {
    id: 'beef_sirloin',
    name: 'Bife de chorizo / Solomillo',
    category: 'proteins',
    per100g: { calories: 201, protein: 26.2, carbs: 0, fat: 10.2 },
    defaultPortionGrams: 180,
    portionLabel: '1 bife (180g)'
  },
  {
    id: 'beef_ground_lean',
    name: 'Carne picada magra (5% grasa)',
    category: 'proteins',
    per100g: { calories: 137, protein: 21.4, carbs: 0, fat: 5.0 },
    defaultPortionGrams: 150,
    portionLabel: '1 porción (150g)'
  },
  {
    id: 'pork_tenderloin',
    name: 'Solomillo de cerdo',
    category: 'proteins',
    per100g: { calories: 143, protein: 26.2, carbs: 0, fat: 3.5 },
    defaultPortionGrams: 150,
    portionLabel: '1 porción (150g)'
  },
  {
    id: 'cooked_ham',
    name: 'Jamón cocido natural',
    category: 'proteins',
    per100g: { calories: 108, protein: 18.5, carbs: 1.5, fat: 3.0 },
    defaultPortionGrams: 40,
    portionLabel: '2 fetas (40g)'
  },
  {
    id: 'serrano_ham',
    name: 'Jamón crudo / Serrano',
    category: 'proteins',
    per100g: { calories: 241, protein: 31.0, carbs: 0, fat: 13.0 },
    defaultPortionGrams: 30,
    portionLabel: '2 lonjas (30g)'
  },
  {
    id: 'salmon',
    name: 'Salmón rosado fresco',
    category: 'proteins',
    per100g: { calories: 208, protein: 20.4, carbs: 0, fat: 13.4 },
    defaultPortionGrams: 150,
    portionLabel: '1 posta (150g)'
  },
  {
    id: 'tuna_water',
    name: 'Atún al natural (escurrido)',
    category: 'proteins',
    per100g: { calories: 116, protein: 25.5, carbs: 0, fat: 0.8 },
    defaultPortionGrams: 120,
    portionLabel: '1 lata escurrida (120g)'
  },
  {
    id: 'tuna_olive_oil',
    name: 'Atún en aceite de oliva (escurrido)',
    category: 'proteins',
    per100g: { calories: 198, protein: 29.1, carbs: 0, fat: 8.2 },
    defaultPortionGrams: 120,
    portionLabel: '1 lata escurrida (120g)'
  },
  {
    id: 'hake_fillet',
    name: 'Filete de merluza',
    category: 'proteins',
    per100g: { calories: 89, protein: 17.8, carbs: 0, fat: 1.6 },
    defaultPortionGrams: 160,
    portionLabel: '1 filete (160g)'
  },
  {
    id: 'cod_fish',
    name: 'Bacalao fresco',
    category: 'proteins',
    per100g: { calories: 82, protein: 17.8, carbs: 0, fat: 0.7 },
    defaultPortionGrams: 150,
    portionLabel: '1 lomo (150g)'
  },
  {
    id: 'shrimp',
    name: 'Langostinos / Camarones pelados',
    category: 'proteins',
    per100g: { calories: 99, protein: 24.0, carbs: 0.2, fat: 0.3 },
    defaultPortionGrams: 120,
    portionLabel: '1 porción (120g)'
  },
  {
    id: 'sardines',
    name: 'Sardinas al natural',
    category: 'proteins',
    per100g: { calories: 185, protein: 24.6, carbs: 0, fat: 9.5 },
    defaultPortionGrams: 90,
    portionLabel: '1 lata (90g)'
  },
  {
    id: 'tofu_firm',
    name: 'Tofu firme',
    category: 'proteins',
    per100g: { calories: 144, protein: 15.8, carbs: 2.8, fat: 8.7 },
    defaultPortionGrams: 125,
    portionLabel: '1/2 bloque (125g)'
  },
  {
    id: 'tempeh',
    name: 'Tempeh',
    category: 'proteins',
    per100g: { calories: 193, protein: 19.0, carbs: 9.4, fat: 10.8 },
    defaultPortionGrams: 100,
    portionLabel: '1 porción (100g)'
  },
  {
    id: 'seitan',
    name: 'Seitán',
    category: 'proteins',
    per100g: { calories: 122, protein: 24.7, carbs: 3.8, fat: 1.1 },
    defaultPortionGrams: 120,
    portionLabel: '1 porción (120g)'
  },
  {
    id: 'textured_soy',
    name: 'Soja texturizada (seca)',
    category: 'proteins',
    per100g: { calories: 336, protein: 50.0, carbs: 30.0, fat: 1.2 },
    defaultPortionGrams: 40,
    portionLabel: '1/2 taza seca (40g)'
  },
  {
    id: 'edamame',
    name: 'Edamame desgranado',
    category: 'proteins',
    per100g: { calories: 121, protein: 11.9, carbs: 8.9, fat: 5.2 },
    defaultPortionGrams: 100,
    portionLabel: '2/3 taza (100g)'
  },
  {
    id: 'mackerel',
    name: 'Caballa al natural',
    category: 'proteins',
    per100g: { calories: 205, protein: 18.6, carbs: 0, fat: 13.9 },
    defaultPortionGrams: 100,
    portionLabel: '1 porción (100g)'
  },
  {
    id: 'squid',
    name: 'Calamar limpio',
    category: 'proteins',
    per100g: { calories: 92, protein: 15.6, carbs: 3.1, fat: 1.4 },
    defaultPortionGrams: 150,
    portionLabel: '1 porción (150g)'
  },
  {
    id: 'turkey_deli',
    name: 'Fiambre de pechuga de pavo',
    category: 'proteins',
    per100g: { calories: 98, protein: 19.5, carbs: 2.0, fat: 1.2 },
    defaultPortionGrams: 50,
    portionLabel: '3 fetas (50g)'
  },
  {
    id: 'bacon',
    name: 'Panceta / Bacon ahumado',
    category: 'proteins',
    per100g: { calories: 417, protein: 13.0, carbs: 1.4, fat: 40.0 },
    defaultPortionGrams: 25,
    portionLabel: '2 tiras (25g)'
  },
  {
    id: 'lamb_leg',
    name: 'Cordero magro',
    category: 'proteins',
    per100g: { calories: 191, protein: 25.5, carbs: 0, fat: 9.2 },
    defaultPortionGrams: 150,
    portionLabel: '1 porción (150g)'
  },
  {
    id: 'trout',
    name: 'Trucha fresca',
    category: 'proteins',
    per100g: { calories: 148, protein: 20.8, carbs: 0, fat: 6.6 },
    defaultPortionGrams: 160,
    portionLabel: '1 filete (160g)'
  },

  // --- Cortes específicos de Res / Vacuna ---
  {
    id: 'beef_asado_tira',
    name: 'Asado de tira / Costilla vacuna',
    category: 'proteins',
    per100g: { calories: 291, protein: 22.5, carbs: 0, fat: 22.0 },
    defaultPortionGrams: 200,
    portionLabel: '1 porción (200g)'
  },
  {
    id: 'beef_vacio',
    name: 'Vacío vacuno (a la parrilla / horno)',
    category: 'proteins',
    per100g: { calories: 235, protein: 25.0, carbs: 0, fat: 14.5 },
    defaultPortionGrams: 180,
    portionLabel: '1 porción (180g)'
  },
  {
    id: 'beef_entrana',
    name: 'Entraña vacuna',
    category: 'proteins',
    per100g: { calories: 220, protein: 25.8, carbs: 0, fat: 12.4 },
    defaultPortionGrams: 180,
    portionLabel: '1 porción (180g)'
  },
  {
    id: 'beef_matambre',
    name: 'Matambre vacuno',
    category: 'proteins',
    per100g: { calories: 248, protein: 23.2, carbs: 0, fat: 16.8 },
    defaultPortionGrams: 160,
    portionLabel: '1 porción (160g)'
  },
  {
    id: 'beef_lomo',
    name: 'Lomo vacuno (cocido)',
    category: 'proteins',
    per100g: { calories: 172, protein: 27.5, carbs: 0, fat: 6.2 },
    defaultPortionGrams: 170,
    portionLabel: '1 medallón (170g)'
  },
  {
    id: 'beef_cuadril',
    name: 'Cuadril vacuno (sin grasa)',
    category: 'proteins',
    per100g: { calories: 168, protein: 26.8, carbs: 0, fat: 6.0 },
    defaultPortionGrams: 170,
    portionLabel: '1 bife (170g)'
  },
  {
    id: 'beef_nalga',
    name: 'Nalga vacuna (sin grasa)',
    category: 'proteins',
    per100g: { calories: 145, protein: 24.5, carbs: 0, fat: 4.5 },
    defaultPortionGrams: 150,
    portionLabel: '1 bife (150g)'
  },
  {
    id: 'beef_bola_lomo',
    name: 'Bola de lomo vacuna',
    category: 'proteins',
    per100g: { calories: 152, protein: 24.8, carbs: 0, fat: 5.2 },
    defaultPortionGrams: 150,
    portionLabel: '1 bife (150g)'
  },
  {
    id: 'beef_peceto',
    name: 'Peceto vacuno (cocido)',
    category: 'proteins',
    per100g: { calories: 158, protein: 27.0, carbs: 0, fat: 4.8 },
    defaultPortionGrams: 140,
    portionLabel: '3 rodajas (140g)'
  },
  {
    id: 'beef_ojo_bife',
    name: 'Ojo de bife',
    category: 'proteins',
    per100g: { calories: 224, protein: 25.5, carbs: 0, fat: 13.0 },
    defaultPortionGrams: 200,
    portionLabel: '1 bife (200g)'
  },
  {
    id: 'beef_bife_angosto',
    name: 'Bife angosto',
    category: 'proteins',
    per100g: { calories: 195, protein: 26.0, carbs: 0, fat: 9.6 },
    defaultPortionGrams: 180,
    portionLabel: '1 bife (180g)'
  },
  {
    id: 'beef_bife_ancho',
    name: 'Bife ancho',
    category: 'proteins',
    per100g: { calories: 238, protein: 24.5, carbs: 0, fat: 15.0 },
    defaultPortionGrams: 190,
    portionLabel: '1 bife (190g)'
  },
  {
    id: 'beef_colita_cuadril',
    name: 'Colita de cuadril (al horno / parrilla)',
    category: 'proteins',
    per100g: { calories: 188, protein: 26.2, carbs: 0, fat: 8.6 },
    defaultPortionGrams: 170,
    portionLabel: '1 porción (170g)'
  },
  {
    id: 'beef_tapa_asado',
    name: 'Tapa de asado',
    category: 'proteins',
    per100g: { calories: 245, protein: 24.0, carbs: 0, fat: 16.0 },
    defaultPortionGrams: 180,
    portionLabel: '1 porción (180g)'
  },
  {
    id: 'beef_tapa_nalga',
    name: 'Tapa de nalga',
    category: 'proteins',
    per100g: { calories: 178, protein: 25.5, carbs: 0, fat: 7.8 },
    defaultPortionGrams: 170,
    portionLabel: '1 porción (170g)'
  },
  {
    id: 'beef_paleta',
    name: 'Paleta vacuna',
    category: 'proteins',
    per100g: { calories: 174, protein: 24.6, carbs: 0, fat: 7.9 },
    defaultPortionGrams: 160,
    portionLabel: '1 porción (160g)'
  },
  {
    id: 'beef_roast_beef',
    name: 'Roast beef / Aguja vacuna',
    category: 'proteins',
    per100g: { calories: 198, protein: 25.2, carbs: 0, fat: 10.2 },
    defaultPortionGrams: 170,
    portionLabel: '1 porción (170g)'
  },
  {
    id: 'beef_osobuco',
    name: 'Osobuco vacuno (cocido)',
    category: 'proteins',
    per100g: { calories: 189, protein: 26.4, carbs: 0, fat: 8.5 },
    defaultPortionGrams: 180,
    portionLabel: '1 rodaja (180g)'
  },
  {
    id: 'beef_ground_regular',
    name: 'Carne picada común (15-20% grasa)',
    category: 'proteins',
    per100g: { calories: 254, protein: 17.2, carbs: 0, fat: 20.0 },
    defaultPortionGrams: 150,
    portionLabel: '1 porción (150g)'
  },
  {
    id: 'chorizo_criollo',
    name: 'Chorizo criollo (parrillero)',
    category: 'proteins',
    per100g: { calories: 325, protein: 14.5, carbs: 2.0, fat: 28.5 },
    defaultPortionGrams: 100,
    portionLabel: '1 chorizo (100g)'
  },
  {
    id: 'morcilla_criolla',
    name: 'Morcilla criolla',
    category: 'proteins',
    per100g: { calories: 268, protein: 14.0, carbs: 3.5, fat: 22.0 },
    defaultPortionGrams: 90,
    portionLabel: '1 morcilla chica (90g)'
  },
  {
    id: 'beef_molleja',
    name: 'Molleja vacuna (a la parrilla)',
    category: 'proteins',
    per100g: { calories: 236, protein: 18.2, carbs: 0, fat: 17.8 },
    defaultPortionGrams: 120,
    portionLabel: '1 porción (120g)'
  },
  {
    id: 'beef_chinchulin',
    name: 'Chinchulín vacuno (a la parrilla)',
    category: 'proteins',
    per100g: { calories: 215, protein: 16.5, carbs: 0, fat: 16.2 },
    defaultPortionGrams: 100,
    portionLabel: '1 porción (100g)'
  },

  // --- Cortes específicos de Cerdo ---
  {
    id: 'pork_bondiola',
    name: 'Bondiola de cerdo (al horno / parrilla)',
    category: 'proteins',
    per100g: { calories: 262, protein: 21.8, carbs: 0, fat: 19.0 },
    defaultPortionGrams: 180,
    portionLabel: '1 porción (180g)'
  },
  {
    id: 'pork_pechito',
    name: 'Pechito de cerdo',
    category: 'proteins',
    per100g: { calories: 295, protein: 20.5, carbs: 0, fat: 23.2 },
    defaultPortionGrams: 180,
    portionLabel: '1 porción (180g)'
  },
  {
    id: 'pork_carre',
    name: 'Carré de cerdo (sin hueso)',
    category: 'proteins',
    per100g: { calories: 162, protein: 25.4, carbs: 0, fat: 6.2 },
    defaultPortionGrams: 160,
    portionLabel: '1 medallón (160g)'
  },
  {
    id: 'pork_matambrito',
    name: 'Matambrito de cerdo',
    category: 'proteins',
    per100g: { calories: 242, protein: 22.0, carbs: 0, fat: 16.8 },
    defaultPortionGrams: 170,
    portionLabel: '1 porción (170g)'
  },
  {
    id: 'pork_costillita',
    name: 'Costillita / Chuleta de cerdo',
    category: 'proteins',
    per100g: { calories: 218, protein: 24.0, carbs: 0, fat: 13.0 },
    defaultPortionGrams: 160,
    portionLabel: '1 costillita (160g)'
  },
  {
    id: 'pork_paleta',
    name: 'Paleta de cerdo',
    category: 'proteins',
    per100g: { calories: 228, protein: 22.8, carbs: 0, fat: 14.8 },
    defaultPortionGrams: 160,
    portionLabel: '1 porción (160g)'
  },
  {
    id: 'pork_nalga',
    name: 'Nalga / Jamón fresco de cerdo',
    category: 'proteins',
    per100g: { calories: 148, protein: 24.2, carbs: 0, fat: 5.2 },
    defaultPortionGrams: 150,
    portionLabel: '1 bife (150g)'
  },
  {
    id: 'pork_ground',
    name: 'Carne picada de cerdo',
    category: 'proteins',
    per100g: { calories: 263, protein: 16.9, carbs: 0, fat: 21.2 },
    defaultPortionGrams: 150,
    portionLabel: '1 porción (150g)'
  },

  // --- Cortes específicos de Pollo ---
  {
    id: 'chicken_pata_muslo_skinless',
    name: 'Pata muslo de pollo (sin piel)',
    category: 'proteins',
    per100g: { calories: 172, protein: 24.2, carbs: 0, fat: 7.8 },
    defaultPortionGrams: 180,
    portionLabel: '1 pata muslo (180g)'
  },
  {
    id: 'chicken_pata_muslo_skin',
    name: 'Pata muslo de pollo (con piel)',
    category: 'proteins',
    per100g: { calories: 226, protein: 22.0, carbs: 0, fat: 14.8 },
    defaultPortionGrams: 200,
    portionLabel: '1 pata muslo (200g)'
  },
  {
    id: 'chicken_drumstick',
    name: 'Pata de pollo (sin piel)',
    category: 'proteins',
    per100g: { calories: 155, protein: 24.5, carbs: 0, fat: 5.7 },
    defaultPortionGrams: 110,
    portionLabel: '1 pata (110g)'
  },
  {
    id: 'chicken_wings',
    name: 'Alitas de pollo (con piel, cocidas)',
    category: 'proteins',
    per100g: { calories: 254, protein: 23.5, carbs: 0, fat: 17.2 },
    defaultPortionGrams: 120,
    portionLabel: '3 alitas (120g)'
  },
  {
    id: 'chicken_suprema',
    name: 'Suprema de pollo (filete sin rebozar)',
    category: 'proteins',
    per100g: { calories: 124, protein: 23.0, carbs: 0, fat: 2.8 },
    defaultPortionGrams: 160,
    portionLabel: '1 suprema (160g)'
  },
  {
    id: 'chicken_roast_whole',
    name: 'Pollo al spiedo / al horno (promedio)',
    category: 'proteins',
    per100g: { calories: 215, protein: 25.0, carbs: 0, fat: 12.2 },
    defaultPortionGrams: 180,
    portionLabel: '1/4 de pollo (180g)'
  },
  {
    id: 'chicken_liver',
    name: 'Hígado / Menudos de pollo',
    category: 'proteins',
    per100g: { calories: 167, protein: 24.5, carbs: 0.9, fat: 6.5 },
    defaultPortionGrams: 120,
    portionLabel: '1 porción (120g)'
  },

  // --- Pescados principales ---
  {
    id: 'fish_abadejo',
    name: 'Abadejo fresco',
    category: 'proteins',
    per100g: { calories: 92, protein: 19.4, carbs: 0, fat: 1.2 },
    defaultPortionGrams: 160,
    portionLabel: '1 filete (160g)'
  },
  {
    id: 'fish_pejerrey',
    name: 'Pejerrey fresco',
    category: 'proteins',
    per100g: { calories: 98, protein: 18.8, carbs: 0, fat: 2.2 },
    defaultPortionGrams: 150,
    portionLabel: '1 porción (150g)'
  },
  {
    id: 'fish_surubi',
    name: 'Surubí fresco',
    category: 'proteins',
    per100g: { calories: 138, protein: 19.2, carbs: 0, fat: 6.5 },
    defaultPortionGrams: 170,
    portionLabel: '1 posta (170g)'
  },
  {
    id: 'fish_dorado',
    name: 'Dorado de río fresco',
    category: 'proteins',
    per100g: { calories: 142, protein: 19.8, carbs: 0, fat: 6.8 },
    defaultPortionGrams: 170,
    portionLabel: '1 posta (170g)'
  },
  {
    id: 'fish_lenguado',
    name: 'Lenguado fresco',
    category: 'proteins',
    per100g: { calories: 86, protein: 17.6, carbs: 0, fat: 1.4 },
    defaultPortionGrams: 160,
    portionLabel: '1 filete (160g)'
  },
  {
    id: 'fish_brotola',
    name: 'Brótola fresca',
    category: 'proteins',
    per100g: { calories: 88, protein: 18.2, carbs: 0, fat: 1.3 },
    defaultPortionGrams: 160,
    portionLabel: '1 filete (160g)'
  },
  {
    id: 'fish_tuna_fresh',
    name: 'Atún rojo fresco (lomo)',
    category: 'proteins',
    per100g: { calories: 144, protein: 23.3, carbs: 0, fat: 4.9 },
    defaultPortionGrams: 150,
    portionLabel: '1 posta (150g)'
  },
  {
    id: 'fish_corvina',
    name: 'Corvina fresca',
    category: 'proteins',
    per100g: { calories: 104, protein: 19.0, carbs: 0, fat: 2.8 },
    defaultPortionGrams: 170,
    portionLabel: '1 filete (170g)'
  },
  {
    id: 'fish_salmon_blanco',
    name: 'Salmón blanco fresco',
    category: 'proteins',
    per100g: { calories: 112, protein: 19.5, carbs: 0, fat: 3.4 },
    defaultPortionGrams: 160,
    portionLabel: '1 filete (160g)'
  },

  // =========================================================================
  // HUEVOS Y LÁCTEOS (19 ítems)
  // =========================================================================
  {
    id: 'egg_whole',
    name: 'Huevo entero',
    category: 'eggs_dairy',
    per100g: { calories: 143, protein: 12.6, carbs: 0.7, fat: 9.5 },
    defaultPortionGrams: 55,
    portionLabel: '1 huevo mediano (55g)'
  },
  {
    id: 'egg_white',
    name: 'Clara de huevo',
    category: 'eggs_dairy',
    per100g: { calories: 52, protein: 10.9, carbs: 0.7, fat: 0.2 },
    defaultPortionGrams: 100,
    portionLabel: '3 claras (100g)'
  },
  {
    id: 'greek_yogurt_natural',
    name: 'Yogur griego natural sin azúcar',
    category: 'eggs_dairy',
    per100g: { calories: 97, protein: 9.0, carbs: 3.6, fat: 5.0 },
    defaultPortionGrams: 150,
    portionLabel: '1 pote individual (150g)'
  },
  {
    id: 'greek_yogurt_0',
    name: 'Yogur griego descremado 0%',
    category: 'eggs_dairy',
    per100g: { calories: 59, protein: 10.2, carbs: 3.6, fat: 0.4 },
    defaultPortionGrams: 170,
    portionLabel: '1 pote (170g)'
  },
  {
    id: 'skyr',
    name: 'Skyr natural',
    category: 'eggs_dairy',
    per100g: { calories: 63, protein: 11.0, carbs: 4.0, fat: 0.2 },
    defaultPortionGrams: 150,
    portionLabel: '1 envase (150g)'
  },
  {
    id: 'milk_whole',
    name: 'Leche entera',
    category: 'eggs_dairy',
    per100g: { calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3 },
    defaultPortionGrams: 240,
    portionLabel: '1 taza (240ml)'
  },
  {
    id: 'milk_skim',
    name: 'Leche descremada',
    category: 'eggs_dairy',
    per100g: { calories: 34, protein: 3.4, carbs: 5.0, fat: 0.1 },
    defaultPortionGrams: 240,
    portionLabel: '1 taza (240ml)'
  },
  {
    id: 'milk_semi',
    name: 'Leche semidescremada',
    category: 'eggs_dairy',
    per100g: { calories: 47, protein: 3.3, carbs: 4.9, fat: 1.5 },
    defaultPortionGrams: 240,
    portionLabel: '1 taza (240ml)'
  },
  {
    id: 'cottage_cheese',
    name: 'Queso cottage',
    category: 'eggs_dairy',
    per100g: { calories: 98, protein: 11.1, carbs: 3.4, fat: 4.3 },
    defaultPortionGrams: 120,
    portionLabel: '1/2 taza (120g)'
  },
  {
    id: 'ricotta_light',
    name: 'Ricotta magra',
    category: 'eggs_dairy',
    per100g: { calories: 138, protein: 11.4, carbs: 5.1, fat: 7.9 },
    defaultPortionGrams: 80,
    portionLabel: '3 cucharadas (80g)'
  },
  {
    id: 'mozzarella',
    name: 'Queso mozzarella',
    category: 'eggs_dairy',
    per100g: { calories: 280, protein: 22.0, carbs: 2.2, fat: 20.5 },
    defaultPortionGrams: 40,
    portionLabel: '2 fetas (40g)'
  },
  {
    id: 'fresh_cheese_light',
    name: 'Queso fresco / Port Salut light',
    category: 'eggs_dairy',
    per100g: { calories: 195, protein: 21.0, carbs: 2.0, fat: 11.5 },
    defaultPortionGrams: 45,
    portionLabel: '1 feta gruesa (45g)'
  },
  {
    id: 'parmesan',
    name: 'Queso parmesano rallado',
    category: 'eggs_dairy',
    per100g: { calories: 431, protein: 38.5, carbs: 4.1, fat: 28.6 },
    defaultPortionGrams: 15,
    portionLabel: '1 cucharada colmada (15g)'
  },
  {
    id: 'feta_cheese',
    name: 'Queso feta',
    category: 'eggs_dairy',
    per100g: { calories: 264, protein: 14.2, carbs: 4.1, fat: 21.3 },
    defaultPortionGrams: 40,
    portionLabel: '1 porción (40g)'
  },
  {
    id: 'cream_cheese_light',
    name: 'Queso crema light',
    category: 'eggs_dairy',
    per100g: { calories: 175, protein: 7.5, carbs: 5.2, fat: 13.5 },
    defaultPortionGrams: 30,
    portionLabel: '1 cucharada generosa (30g)'
  },
  {
    id: 'cheddar_cheese',
    name: 'Queso cheddar',
    category: 'eggs_dairy',
    per100g: { calories: 403, protein: 24.9, carbs: 1.3, fat: 33.1 },
    defaultPortionGrams: 30,
    portionLabel: '1 feta (30g)'
  },
  {
    id: 'kefir',
    name: 'Kéfir natural',
    category: 'eggs_dairy',
    per100g: { calories: 52, protein: 3.4, carbs: 4.5, fat: 2.1 },
    defaultPortionGrams: 200,
    portionLabel: '1 vaso (200ml)'
  },
  {
    id: 'oat_milk',
    name: 'Bebida de avena sin azúcar',
    category: 'eggs_dairy',
    per100g: { calories: 42, protein: 0.8, carbs: 6.7, fat: 1.3 },
    defaultPortionGrams: 240,
    portionLabel: '1 taza (240ml)'
  },
  {
    id: 'almond_milk',
    name: 'Leche de almendras sin azúcar',
    category: 'eggs_dairy',
    per100g: { calories: 15, protein: 0.5, carbs: 0.3, fat: 1.2 },
    defaultPortionGrams: 240,
    portionLabel: '1 taza (240ml)'
  },

  // =========================================================================
  // CEREALES, PANES Y LEGUMBRES (26 ítems)
  // =========================================================================
  {
    id: 'oats_rolled',
    name: 'Avena arrollada (seca)',
    category: 'grains_legumes',
    per100g: { calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9 },
    defaultPortionGrams: 50,
    portionLabel: '1/2 taza (50g)'
  },
  {
    id: 'white_rice_cooked',
    name: 'Arroz blanco cocido',
    category: 'grains_legumes',
    per100g: { calories: 130, protein: 2.7, carbs: 28.2, fat: 0.3 },
    defaultPortionGrams: 160,
    portionLabel: '1 taza cocida (160g)'
  },
  {
    id: 'brown_rice_cooked',
    name: 'Arroz integral cocido',
    category: 'grains_legumes',
    per100g: { calories: 123, protein: 2.7, carbs: 25.6, fat: 1.0 },
    defaultPortionGrams: 160,
    portionLabel: '1 taza cocida (160g)'
  },
  {
    id: 'quinoa_cooked',
    name: 'Quinoa cocida',
    category: 'grains_legumes',
    per100g: { calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9 },
    defaultPortionGrams: 150,
    portionLabel: '1 taza cocida (150g)'
  },
  {
    id: 'pasta_cooked',
    name: 'Pasta / Fideos cocidos',
    category: 'grains_legumes',
    per100g: { calories: 131, protein: 5.0, carbs: 25.0, fat: 1.1 },
    defaultPortionGrams: 180,
    portionLabel: '1 plato mediano (180g)'
  },
  {
    id: 'whole_pasta_cooked',
    name: 'Pasta integral cocida',
    category: 'grains_legumes',
    per100g: { calories: 124, protein: 5.3, carbs: 26.5, fat: 0.5 },
    defaultPortionGrams: 180,
    portionLabel: '1 plato mediano (180g)'
  },
  {
    id: 'whole_wheat_bread',
    name: 'Pan integral de molde',
    category: 'grains_legumes',
    per100g: { calories: 247, protein: 12.5, carbs: 41.0, fat: 3.4 },
    defaultPortionGrams: 30,
    portionLabel: '1 rebanada (30g)'
  },
  {
    id: 'sourdough_bread',
    name: 'Pan de masa madre',
    category: 'grains_legumes',
    per100g: { calories: 268, protein: 9.2, carbs: 53.0, fat: 1.5 },
    defaultPortionGrams: 45,
    portionLabel: '1 rebanada artesanal (45g)'
  },
  {
    id: 'baguette',
    name: 'Pan francés / Baguette',
    category: 'grains_legumes',
    per100g: { calories: 272, protein: 9.5, carbs: 56.0, fat: 1.2 },
    defaultPortionGrams: 50,
    portionLabel: '1 trozo mediano (50g)'
  },
  {
    id: 'corn_tortilla',
    name: 'Tortilla de maíz',
    category: 'grains_legumes',
    per100g: { calories: 218, protein: 5.7, carbs: 44.6, fat: 2.8 },
    defaultPortionGrams: 30,
    portionLabel: '1 tortilla (30g)'
  },
  {
    id: 'wheat_wrap',
    name: 'Tortilla / Rapidita de trigo',
    category: 'grains_legumes',
    per100g: { calories: 304, protein: 8.2, carbs: 50.5, fat: 7.4 },
    defaultPortionGrams: 40,
    portionLabel: '1 tortilla mediana (40g)'
  },
  {
    id: 'rice_cakes',
    name: 'Galletas de arroz integral',
    category: 'grains_legumes',
    per100g: { calories: 387, protein: 8.2, carbs: 81.5, fat: 2.8 },
    defaultPortionGrams: 18,
    portionLabel: '2 galletas (18g)'
  },
  {
    id: 'potato_boiled',
    name: 'Papa cocida / al horno',
    category: 'grains_legumes',
    per100g: { calories: 87, protein: 1.9, carbs: 20.1, fat: 0.1 },
    defaultPortionGrams: 180,
    portionLabel: '1 papa mediana (180g)'
  },
  {
    id: 'sweet_potato',
    name: 'Batata / Boniato cocido',
    category: 'grains_legumes',
    per100g: { calories: 90, protein: 2.0, carbs: 20.7, fat: 0.2 },
    defaultPortionGrams: 170,
    portionLabel: '1 batata mediana (170g)'
  },
  {
    id: 'lentils_cooked',
    name: 'Lentejas cocidas',
    category: 'grains_legumes',
    per100g: { calories: 116, protein: 9.0, carbs: 20.1, fat: 0.4 },
    defaultPortionGrams: 160,
    portionLabel: '1 taza cocida (160g)'
  },
  {
    id: 'chickpeas_cooked',
    name: 'Garbanzos cocidos',
    category: 'grains_legumes',
    per100g: { calories: 164, protein: 8.9, carbs: 27.4, fat: 2.6 },
    defaultPortionGrams: 150,
    portionLabel: '1 taza cocida (150g)'
  },
  {
    id: 'black_beans_cooked',
    name: 'Porotos negros / Frijoles cocidos',
    category: 'grains_legumes',
    per100g: { calories: 132, protein: 8.9, carbs: 23.7, fat: 0.5 },
    defaultPortionGrams: 150,
    portionLabel: '1 taza cocida (150g)'
  },
  {
    id: 'couscous_cooked',
    name: 'Cuscús cocido',
    category: 'grains_legumes',
    per100g: { calories: 112, protein: 3.8, carbs: 23.2, fat: 0.2 },
    defaultPortionGrams: 150,
    portionLabel: '1 taza cocida (150g)'
  },
  {
    id: 'granola',
    name: 'Granola artesanal con miel',
    category: 'grains_legumes',
    per100g: { calories: 471, protein: 10.5, carbs: 64.0, fat: 20.0 },
    defaultPortionGrams: 40,
    portionLabel: '1/3 taza (40g)'
  },
  {
    id: 'wheat_flour',
    name: 'Harina de trigo',
    category: 'grains_legumes',
    per100g: { calories: 364, protein: 10.3, carbs: 76.3, fat: 1.0 },
    defaultPortionGrams: 50,
    portionLabel: '1/2 taza (50g)'
  },
  {
    id: 'almond_flour',
    name: 'Harina de almendras',
    category: 'grains_legumes',
    per100g: { calories: 571, protein: 21.4, carbs: 21.4, fat: 50.0 },
    defaultPortionGrams: 30,
    portionLabel: '1/4 taza (30g)'
  },
  {
    id: 'polenta_cooked',
    name: 'Polenta cocida',
    category: 'grains_legumes',
    per100g: { calories: 70, protein: 1.6, carbs: 15.0, fat: 0.3 },
    defaultPortionGrams: 200,
    portionLabel: '1 plato (200g)'
  },
  {
    id: 'corn_kernels',
    name: 'Choclo / Maíz dulce cocido',
    category: 'grains_legumes',
    per100g: { calories: 96, protein: 3.4, carbs: 21.0, fat: 1.5 },
    defaultPortionGrams: 100,
    portionLabel: '2/3 taza (100g)'
  },
  {
    id: 'hummus',
    name: 'Hummus de garbanzo',
    category: 'grains_legumes',
    per100g: { calories: 166, protein: 7.9, carbs: 14.3, fat: 9.6 },
    defaultPortionGrams: 50,
    portionLabel: '2 cucharadas (50g)'
  },
  {
    id: 'peas_cooked',
    name: 'Arvejas / Guisantes cocidos',
    category: 'grains_legumes',
    per100g: { calories: 84, protein: 5.4, carbs: 15.6, fat: 0.2 },
    defaultPortionGrams: 100,
    portionLabel: '2/3 taza (100g)'
  },
  {
    id: 'bagel',
    name: 'Bagel clásico',
    category: 'grains_legumes',
    per100g: { calories: 257, protein: 10.0, carbs: 50.5, fat: 1.6 },
    defaultPortionGrams: 95,
    portionLabel: '1 bagel (95g)'
  },

  // --- Cereales y Granos ---
  {
    id: 'corn_flakes_plain',
    name: 'Copos de maíz sin azúcar (Corn Flakes)',
    category: 'grains_legumes',
    per100g: { calories: 357, protein: 7.5, carbs: 84.0, fat: 0.4 },
    defaultPortionGrams: 30,
    portionLabel: '1 taza (30g)'
  },
  {
    id: 'corn_flakes_frosted',
    name: 'Copos de maíz azucarados (Zucaritas)',
    category: 'grains_legumes',
    per100g: { calories: 380, protein: 5.0, carbs: 88.0, fat: 0.5 },
    defaultPortionGrams: 30,
    portionLabel: '3/4 taza (30g)'
  },
  {
    id: 'honey_oat_rings',
    name: 'Aros de avena con miel (cereal)',
    category: 'grains_legumes',
    per100g: { calories: 385, protein: 8.5, carbs: 79.0, fat: 3.8 },
    defaultPortionGrams: 30,
    portionLabel: '1 taza (30g)'
  },
  {
    id: 'cereal_pillows_choco',
    name: 'Almohaditas rellenas de chocolate / avellana',
    category: 'grains_legumes',
    per100g: { calories: 445, protein: 6.5, carbs: 69.0, fat: 15.5 },
    defaultPortionGrams: 35,
    portionLabel: '1/2 taza (35g)'
  },
  {
    id: 'puffed_rice',
    name: 'Arroz inflado sin azúcar (tutuca / cereal)',
    category: 'grains_legumes',
    per100g: { calories: 382, protein: 6.8, carbs: 87.5, fat: 0.9 },
    defaultPortionGrams: 25,
    portionLabel: '1 taza (25g)'
  },
  {
    id: 'oat_bran',
    name: 'Salvado de avena',
    category: 'grains_legumes',
    per100g: { calories: 355, protein: 17.3, carbs: 66.2, fat: 7.0 },
    defaultPortionGrams: 30,
    portionLabel: '3 cucharadas (30g)'
  },
  {
    id: 'wheat_bran',
    name: 'Salvado de trigo',
    category: 'grains_legumes',
    per100g: { calories: 216, protein: 15.6, carbs: 64.5, fat: 4.3 },
    defaultPortionGrams: 20,
    portionLabel: '2 cucharadas (20g)'
  },
  {
    id: 'wheat_germ',
    name: 'Germen de trigo',
    category: 'grains_legumes',
    per100g: { calories: 360, protein: 23.2, carbs: 51.8, fat: 9.7 },
    defaultPortionGrams: 15,
    portionLabel: '2 cucharadas (15g)'
  },
  {
    id: 'oats_instant',
    name: 'Avena instantánea (seca)',
    category: 'grains_legumes',
    per100g: { calories: 379, protein: 13.5, carbs: 67.7, fat: 6.5 },
    defaultPortionGrams: 40,
    portionLabel: '1/2 taza (40g)'
  },
  {
    id: 'rice_yamani_cooked',
    name: 'Arroz yamaní cocido',
    category: 'grains_legumes',
    per100g: { calories: 118, protein: 2.6, carbs: 24.8, fat: 0.9 },
    defaultPortionGrams: 160,
    portionLabel: '1 taza cocida (160g)'
  },
  {
    id: 'rice_basmati_cooked',
    name: 'Arroz basmati cocido',
    category: 'grains_legumes',
    per100g: { calories: 121, protein: 3.5, carbs: 25.2, fat: 0.4 },
    defaultPortionGrams: 160,
    portionLabel: '1 taza cocida (160g)'
  },
  {
    id: 'rice_parboil_cooked',
    name: 'Arroz parboil cocido',
    category: 'grains_legumes',
    per100g: { calories: 123, protein: 2.9, carbs: 26.5, fat: 0.3 },
    defaultPortionGrams: 160,
    portionLabel: '1 taza cocida (160g)'
  },
  {
    id: 'barley_cooked',
    name: 'Cebada perlada cocida',
    category: 'grains_legumes',
    per100g: { calories: 123, protein: 2.3, carbs: 28.2, fat: 0.4 },
    defaultPortionGrams: 150,
    portionLabel: '1 taza cocida (150g)'
  },
  {
    id: 'bulgur_cooked',
    name: 'Trigo burgol cocido',
    category: 'grains_legumes',
    per100g: { calories: 83, protein: 3.1, carbs: 18.6, fat: 0.2 },
    defaultPortionGrams: 150,
    portionLabel: '1 taza cocida (150g)'
  },
  {
    id: 'millet_cooked',
    name: 'Mijo cocido',
    category: 'grains_legumes',
    per100g: { calories: 119, protein: 3.5, carbs: 23.7, fat: 1.0 },
    defaultPortionGrams: 150,
    portionLabel: '1 taza cocida (150g)'
  },
  {
    id: 'amaranth_cooked',
    name: 'Amaranto cocido',
    category: 'grains_legumes',
    per100g: { calories: 102, protein: 3.8, carbs: 18.7, fat: 1.6 },
    defaultPortionGrams: 150,
    portionLabel: '1 taza cocida (150g)'
  },
  {
    id: 'cornstarch',
    name: 'Maicena (fécula de maíz)',
    category: 'grains_legumes',
    per100g: { calories: 381, protein: 0.3, carbs: 91.3, fat: 0.1 },
    defaultPortionGrams: 20,
    portionLabel: '2 cucharadas (20g)'
  },
  {
    id: 'semolina',
    name: 'Sémola de trigo (seca)',
    category: 'grains_legumes',
    per100g: { calories: 360, protein: 12.7, carbs: 72.8, fat: 1.1 },
    defaultPortionGrams: 40,
    portionLabel: '3 cucharadas (40g)'
  },
  {
    id: 'oat_flour',
    name: 'Harina de avena',
    category: 'grains_legumes',
    per100g: { calories: 385, protein: 14.5, carbs: 66.0, fat: 7.0 },
    defaultPortionGrams: 40,
    portionLabel: '1/3 taza (40g)'
  },
  {
    id: 'chickpea_flour',
    name: 'Harina de garbanzos',
    category: 'grains_legumes',
    per100g: { calories: 387, protein: 22.4, carbs: 57.8, fat: 6.7 },
    defaultPortionGrams: 50,
    portionLabel: '1/2 taza (50g)'
  },
  {
    id: 'whole_wheat_flour',
    name: 'Harina integral de trigo',
    category: 'grains_legumes',
    per100g: { calories: 340, protein: 13.2, carbs: 72.0, fat: 2.5 },
    defaultPortionGrams: 50,
    portionLabel: '1/2 taza (50g)'
  },
  {
    id: 'granola_no_sugar',
    name: 'Granola sin azúcar agregada',
    category: 'grains_legumes',
    per100g: { calories: 425, protein: 12.5, carbs: 56.0, fat: 16.5 },
    defaultPortionGrams: 40,
    portionLabel: '1/3 taza (40g)'
  },
  {
    id: 'cereal_bar',
    name: 'Barrita de cereal clásica',
    category: 'grains_legumes',
    per100g: { calories: 392, protein: 6.0, carbs: 74.0, fat: 8.5 },
    defaultPortionGrams: 23,
    portionLabel: '1 barrita (23g)'
  },

  // --- Tipos de Panes y Panificados ---
  {
    id: 'bread_lactal_white',
    name: 'Pan lactal blanco',
    category: 'grains_legumes',
    per100g: { calories: 266, protein: 8.5, carbs: 50.0, fat: 3.3 },
    defaultPortionGrams: 25,
    portionLabel: '1 rebanada (25g)'
  },
  {
    id: 'bread_lactal_seeds',
    name: 'Pan lactal con semillas / multicereal',
    category: 'grains_legumes',
    per100g: { calories: 274, protein: 11.2, carbs: 43.0, fat: 6.2 },
    defaultPortionGrams: 30,
    portionLabel: '1 rebanada (30g)'
  },
  {
    id: 'bread_lactal_bran',
    name: 'Pan lactal negro / de salvado',
    category: 'grains_legumes',
    per100g: { calories: 242, protein: 10.5, carbs: 42.5, fat: 3.0 },
    defaultPortionGrams: 28,
    portionLabel: '1 rebanada (28g)'
  },
  {
    id: 'bread_minon',
    name: 'Pan miñón / Flautita (panadería)',
    category: 'grains_legumes',
    per100g: { calories: 275, protein: 9.0, carbs: 57.0, fat: 1.2 },
    defaultPortionGrams: 45,
    portionLabel: '1 miñón (45g)'
  },
  {
    id: 'bread_felipe',
    name: 'Pan felipe / Pan criollo de panadería',
    category: 'grains_legumes',
    per100g: { calories: 278, protein: 9.2, carbs: 56.5, fat: 1.6 },
    defaultPortionGrams: 60,
    portionLabel: '1 felipe (60g)'
  },
  {
    id: 'bread_figazza',
    name: 'Pan figazza / Figacita de manteca',
    category: 'grains_legumes',
    per100g: { calories: 312, protein: 8.8, carbs: 52.0, fat: 7.6 },
    defaultPortionGrams: 40,
    portionLabel: '1 figacita (40g)'
  },
  {
    id: 'bread_pita_white',
    name: 'Pan árabe / Pita blanco',
    category: 'grains_legumes',
    per100g: { calories: 275, protein: 9.1, carbs: 55.7, fat: 1.2 },
    defaultPortionGrams: 60,
    portionLabel: '1 pan árabe (60g)'
  },
  {
    id: 'bread_pita_whole',
    name: 'Pan árabe / Pita integral',
    category: 'grains_legumes',
    per100g: { calories: 262, protein: 9.8, carbs: 52.0, fat: 1.8 },
    defaultPortionGrams: 60,
    portionLabel: '1 pan árabe (60g)'
  },
  {
    id: 'bread_burger',
    name: 'Pan de hamburguesa clásico',
    category: 'grains_legumes',
    per100g: { calories: 279, protein: 8.9, carbs: 50.5, fat: 4.5 },
    defaultPortionGrams: 55,
    portionLabel: '1 pan (55g)'
  },
  {
    id: 'bread_brioche',
    name: 'Pan brioche / Pan de papa para hamburguesa',
    category: 'grains_legumes',
    per100g: { calories: 318, protein: 9.2, carbs: 51.0, fat: 8.6 },
    defaultPortionGrams: 65,
    portionLabel: '1 pan (65g)'
  },
  {
    id: 'bread_hotdog',
    name: 'Pan de pancho / Viena',
    category: 'grains_legumes',
    per100g: { calories: 278, protein: 8.6, carbs: 51.0, fat: 4.3 },
    defaultPortionGrams: 45,
    portionLabel: '1 pan (45g)'
  },
  {
    id: 'bread_ciabatta',
    name: 'Pan ciabatta',
    category: 'grains_legumes',
    per100g: { calories: 271, protein: 9.0, carbs: 52.5, fat: 2.8 },
    defaultPortionGrams: 75,
    portionLabel: '1 ciabatta chica (75g)'
  },
  {
    id: 'bread_campo',
    name: 'Pan de campo artesanal',
    category: 'grains_legumes',
    per100g: { calories: 265, protein: 8.8, carbs: 53.0, fat: 1.8 },
    defaultPortionGrams: 50,
    portionLabel: '1 rebanada (50g)'
  },
  {
    id: 'bread_rye',
    name: 'Pan de centeno',
    category: 'grains_legumes',
    per100g: { calories: 259, protein: 8.5, carbs: 48.3, fat: 3.3 },
    defaultPortionGrams: 35,
    portionLabel: '1 rebanada (35g)'
  },
  {
    id: 'bread_gluten_free',
    name: 'Pan de molde sin gluten',
    category: 'grains_legumes',
    per100g: { calories: 254, protein: 4.2, carbs: 49.0, fat: 4.8 },
    defaultPortionGrams: 30,
    portionLabel: '1 rebanada (30g)'
  },
  {
    id: 'breadcrumbs',
    name: 'Pan rallado',
    category: 'grains_legumes',
    per100g: { calories: 395, protein: 13.4, carbs: 72.0, fat: 5.3 },
    defaultPortionGrams: 30,
    portionLabel: '3 cucharadas (30g)'
  },
  {
    id: 'grisines',
    name: 'Grisines clásicos',
    category: 'grains_legumes',
    per100g: { calories: 412, protein: 12.0, carbs: 68.5, fat: 9.5 },
    defaultPortionGrams: 30,
    portionLabel: '6 grisines (30g)'
  },
  {
    id: 'toast_packaged',
    name: 'Tostadas de mesa / Pan tostado',
    category: 'grains_legumes',
    per100g: { calories: 382, protein: 11.5, carbs: 73.0, fat: 4.8 },
    defaultPortionGrams: 30,
    portionLabel: '3 tostadas (30g)'
  },
  {
    id: 'crackers_water',
    name: 'Galletitas de agua / Criollitas',
    category: 'grains_legumes',
    per100g: { calories: 432, protein: 10.5, carbs: 70.0, fat: 12.0 },
    defaultPortionGrams: 30,
    portionLabel: '5 galletitas (30g)'
  },
  {
    id: 'crackers_bran',
    name: 'Galletitas de salvado / integrales',
    category: 'grains_legumes',
    per100g: { calories: 415, protein: 11.0, carbs: 64.0, fat: 12.5 },
    defaultPortionGrams: 30,
    portionLabel: '5 galletitas (30g)'
  },
  {
    id: 'bizcochos_grasa',
    name: 'Bizcochos de grasa (libritos / cuernitos)',
    category: 'grains_legumes',
    per100g: { calories: 468, protein: 8.5, carbs: 56.0, fat: 23.0 },
    defaultPortionGrams: 40,
    portionLabel: '4 bizcochos (40g)'
  },
  {
    id: 'chipa',
    name: 'Chipá (pan de queso)',
    category: 'grains_legumes',
    per100g: { calories: 356, protein: 10.8, carbs: 42.0, fat: 16.0 },
    defaultPortionGrams: 45,
    portionLabel: '2 chipás chicos (45g)'
  },

  // =========================================================================
  // FRUTAS (18 ítems)
  // =========================================================================
  {
    id: 'banana',
    name: 'Banana / Plátano',
    category: 'fruits',
    per100g: { calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3 },
    defaultPortionGrams: 115,
    portionLabel: '1 banana mediana (115g)'
  },
  {
    id: 'apple',
    name: 'Manzana roja / verde',
    category: 'fruits',
    per100g: { calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2 },
    defaultPortionGrams: 160,
    portionLabel: '1 manzana mediana (160g)'
  },
  {
    id: 'blueberries',
    name: 'Arándanos frescos',
    category: 'fruits',
    per100g: { calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3 },
    defaultPortionGrams: 75,
    portionLabel: '1/2 taza (75g)'
  },
  {
    id: 'strawberries',
    name: 'Frutillas / Fresas',
    category: 'fruits',
    per100g: { calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3 },
    defaultPortionGrams: 120,
    portionLabel: '1 taza (120g)'
  },
  {
    id: 'orange',
    name: 'Naranja',
    category: 'fruits',
    per100g: { calories: 47, protein: 0.9, carbs: 11.8, fat: 0.1 },
    defaultPortionGrams: 150,
    portionLabel: '1 naranja mediana (150g)'
  },
  {
    id: 'mandarin',
    name: 'Mandarina',
    category: 'fruits',
    per100g: { calories: 53, protein: 0.8, carbs: 13.3, fat: 0.3 },
    defaultPortionGrams: 90,
    portionLabel: '1 mandarina (90g)'
  },
  {
    id: 'kiwi',
    name: 'Kiwi',
    category: 'fruits',
    per100g: { calories: 61, protein: 1.1, carbs: 14.7, fat: 0.5 },
    defaultPortionGrams: 75,
    portionLabel: '1 kiwi mediano (75g)'
  },
  {
    id: 'pear',
    name: 'Pera',
    category: 'fruits',
    per100g: { calories: 57, protein: 0.4, carbs: 15.2, fat: 0.1 },
    defaultPortionGrams: 165,
    portionLabel: '1 pera mediana (165g)'
  },
  {
    id: 'mango',
    name: 'Mango fresco',
    category: 'fruits',
    per100g: { calories: 60, protein: 0.8, carbs: 15.0, fat: 0.4 },
    defaultPortionGrams: 150,
    portionLabel: '1 taza en cubos (150g)'
  },
  {
    id: 'pineapple',
    name: 'Ananá / Piña fresca',
    category: 'fruits',
    per100g: { calories: 50, protein: 0.5, carbs: 13.1, fat: 0.1 },
    defaultPortionGrams: 150,
    portionLabel: '2 rodajas (150g)'
  },
  {
    id: 'watermelon',
    name: 'Sandía',
    category: 'fruits',
    per100g: { calories: 30, protein: 0.6, carbs: 7.6, fat: 0.2 },
    defaultPortionGrams: 200,
    portionLabel: '1 tajada (200g)'
  },
  {
    id: 'peach',
    name: 'Durazno / Melocotón',
    category: 'fruits',
    per100g: { calories: 39, protein: 0.9, carbs: 9.5, fat: 0.3 },
    defaultPortionGrams: 140,
    portionLabel: '1 durazno (140g)'
  },
  {
    id: 'grapes',
    name: 'Uvas',
    category: 'fruits',
    per100g: { calories: 69, protein: 0.7, carbs: 18.1, fat: 0.2 },
    defaultPortionGrams: 100,
    portionLabel: '1 racimo chico (100g)'
  },
  {
    id: 'raspberries',
    name: 'Frambuesas',
    category: 'fruits',
    per100g: { calories: 52, protein: 1.2, carbs: 11.9, fat: 0.7 },
    defaultPortionGrams: 70,
    portionLabel: '1/2 taza (70g)'
  },
  {
    id: 'dates',
    name: 'Dátiles secos',
    category: 'fruits',
    per100g: { calories: 277, protein: 1.8, carbs: 75.0, fat: 0.2 },
    defaultPortionGrams: 24,
    portionLabel: '3 dátiles (24g)'
  },
  {
    id: 'raisins',
    name: 'Pasas de uva',
    category: 'fruits',
    per100g: { calories: 299, protein: 3.1, carbs: 79.2, fat: 0.5 },
    defaultPortionGrams: 30,
    portionLabel: '2 cucharadas (30g)'
  },
  {
    id: 'lemon_juice',
    name: 'Jugo de limón natural',
    category: 'fruits',
    per100g: { calories: 22, protein: 0.4, carbs: 6.9, fat: 0.2 },
    defaultPortionGrams: 20,
    portionLabel: '1 cucharada / chorro (20g)'
  },
  {
    id: 'melon',
    name: 'Melón',
    category: 'fruits',
    per100g: { calories: 34, protein: 0.8, carbs: 8.2, fat: 0.2 },
    defaultPortionGrams: 180,
    portionLabel: '1 tajada (180g)'
  },

  // =========================================================================
  // VERDURAS Y HORTALIZAS (20 ítems)
  // =========================================================================
  {
    id: 'spinach',
    name: 'Espinaca fresca',
    category: 'vegetables',
    per100g: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
    defaultPortionGrams: 60,
    portionLabel: '2 tazas crudas (60g)'
  },
  {
    id: 'broccoli',
    name: 'Brócoli al vapor',
    category: 'vegetables',
    per100g: { calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4 },
    defaultPortionGrams: 120,
    portionLabel: '1 taza flores (120g)'
  },
  {
    id: 'tomato',
    name: 'Tomate redondo / perita',
    category: 'vegetables',
    per100g: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
    defaultPortionGrams: 130,
    portionLabel: '1 tomate mediano (130g)'
  },
  {
    id: 'cherry_tomatoes',
    name: 'Tomates cherry',
    category: 'vegetables',
    per100g: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
    defaultPortionGrams: 100,
    portionLabel: '8 tomates cherry (100g)'
  },
  {
    id: 'cucumber',
    name: 'Pepino',
    category: 'vegetables',
    per100g: { calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1 },
    defaultPortionGrams: 100,
    portionLabel: '1/2 pepino (100g)'
  },
  {
    id: 'lettuce',
    name: 'Lechuga / Mix de verdes',
    category: 'vegetables',
    per100g: { calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2 },
    defaultPortionGrams: 60,
    portionLabel: '1 bowl de hojas (60g)'
  },
  {
    id: 'arugula',
    name: 'Rúcula fresca',
    category: 'vegetables',
    per100g: { calories: 25, protein: 2.6, carbs: 3.7, fat: 0.7 },
    defaultPortionGrams: 40,
    portionLabel: '2 puñados (40g)'
  },
  {
    id: 'carrot',
    name: 'Zanahoria',
    category: 'vegetables',
    per100g: { calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2 },
    defaultPortionGrams: 80,
    portionLabel: '1 zanahoria mediana (80g)'
  },
  {
    id: 'bell_pepper',
    name: 'Morrón / Pimiento rojo',
    category: 'vegetables',
    per100g: { calories: 31, protein: 1.0, carbs: 6.0, fat: 0.3 },
    defaultPortionGrams: 90,
    portionLabel: '1/2 pimiento (90g)'
  },
  {
    id: 'onion',
    name: 'Cebolla blanca / morada',
    category: 'vegetables',
    per100g: { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1 },
    defaultPortionGrams: 70,
    portionLabel: '1/2 cebolla mediana (70g)'
  },
  {
    id: 'zucchini',
    name: 'Zucchini / Calabacín',
    category: 'vegetables',
    per100g: { calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3 },
    defaultPortionGrams: 150,
    portionLabel: '1 calabacín chico (150g)'
  },
  {
    id: 'eggplant',
    name: 'Berenjena',
    category: 'vegetables',
    per100g: { calories: 25, protein: 1.0, carbs: 5.9, fat: 0.2 },
    defaultPortionGrams: 150,
    portionLabel: '1/2 berenjena (150g)'
  },
  {
    id: 'mushrooms',
    name: 'Champiñones frescos',
    category: 'vegetables',
    per100g: { calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3 },
    defaultPortionGrams: 100,
    portionLabel: '1 taza laminados (100g)'
  },
  {
    id: 'asparagus',
    name: 'Espárragos verdes',
    category: 'vegetables',
    per100g: { calories: 20, protein: 2.2, carbs: 3.9, fat: 0.1 },
    defaultPortionGrams: 120,
    portionLabel: '6 tallos (120g)'
  },
  {
    id: 'pumpkin',
    name: 'Calabaza / Zapallo anco cocido',
    category: 'vegetables',
    per100g: { calories: 40, protein: 1.0, carbs: 10.0, fat: 0.1 },
    defaultPortionGrams: 180,
    portionLabel: '1 taza en cubos (180g)'
  },
  {
    id: 'cauliflower',
    name: 'Coliflor',
    category: 'vegetables',
    per100g: { calories: 25, protein: 1.9, carbs: 5.0, fat: 0.3 },
    defaultPortionGrams: 120,
    portionLabel: '1 taza (120g)'
  },
  {
    id: 'green_beans',
    name: 'Chauchas / Judías verdes',
    category: 'vegetables',
    per100g: { calories: 31, protein: 1.8, carbs: 7.0, fat: 0.2 },
    defaultPortionGrams: 120,
    portionLabel: '1 taza (120g)'
  },
  {
    id: 'beetroot',
    name: 'Remolacha cocida',
    category: 'vegetables',
    per100g: { calories: 44, protein: 1.7, carbs: 10.0, fat: 0.2 },
    defaultPortionGrams: 100,
    portionLabel: '1 remolacha mediana (100g)'
  },
  {
    id: 'cabbage',
    name: 'Repollo / Col blanca',
    category: 'vegetables',
    per100g: { calories: 25, protein: 1.3, carbs: 5.8, fat: 0.1 },
    defaultPortionGrams: 80,
    portionLabel: '1 taza rallada (80g)'
  },
  {
    id: 'garlic',
    name: 'Ajo fresco',
    category: 'vegetables',
    per100g: { calories: 149, protein: 6.4, carbs: 33.1, fat: 0.5 },
    defaultPortionGrams: 6,
    portionLabel: '2 dientes (6g)'
  },

  // =========================================================================
  // GRASAS SALUDABLES, ACEITES Y FRUTOS SECOS (16 ítems)
  // =========================================================================
  {
    id: 'olive_oil',
    name: 'Aceite de oliva virgen extra',
    category: 'fats_nuts',
    per100g: { calories: 884, protein: 0, carbs: 0, fat: 100.0 },
    defaultPortionGrams: 10,
    portionLabel: '1 cucharada (10g)'
  },
  {
    id: 'avocado',
    name: 'Palta / Aguacate',
    category: 'fats_nuts',
    per100g: { calories: 160, protein: 2.0, carbs: 8.5, fat: 14.7 },
    defaultPortionGrams: 75,
    portionLabel: '1/2 palta mediana (75g)'
  },
  {
    id: 'almonds',
    name: 'Almendras naturales',
    category: 'fats_nuts',
    per100g: { calories: 579, protein: 21.2, carbs: 21.6, fat: 49.9 },
    defaultPortionGrams: 25,
    portionLabel: '1 puñado / ~20 almendras (25g)'
  },
  {
    id: 'walnuts',
    name: 'Nueces peladas',
    category: 'fats_nuts',
    per100g: { calories: 654, protein: 15.2, carbs: 13.7, fat: 65.2 },
    defaultPortionGrams: 25,
    portionLabel: '6 nueces (25g)'
  },
  {
    id: 'peanut_butter',
    name: 'Mantequilla de maní natural',
    category: 'fats_nuts',
    per100g: { calories: 588, protein: 25.1, carbs: 20.0, fat: 50.0 },
    defaultPortionGrams: 20,
    portionLabel: '1 cucharada colmada (20g)'
  },
  {
    id: 'peanuts',
    name: 'Maní tostado sin sal',
    category: 'fats_nuts',
    per100g: { calories: 587, protein: 24.4, carbs: 21.3, fat: 49.7 },
    defaultPortionGrams: 30,
    portionLabel: '1 puñado (30g)'
  },
  {
    id: 'cashews',
    name: 'Castañas de cajú / Anacardos',
    category: 'fats_nuts',
    per100g: { calories: 553, protein: 18.2, carbs: 30.2, fat: 43.8 },
    defaultPortionGrams: 28,
    portionLabel: '1 puñado (28g)'
  },
  {
    id: 'chia_seeds',
    name: 'Semillas de chía',
    category: 'fats_nuts',
    per100g: { calories: 486, protein: 16.5, carbs: 42.1, fat: 30.7 },
    defaultPortionGrams: 15,
    portionLabel: '1 cucharada (15g)'
  },
  {
    id: 'flax_seeds',
    name: 'Semillas de lino molidas',
    category: 'fats_nuts',
    per100g: { calories: 534, protein: 18.3, carbs: 28.9, fat: 42.2 },
    defaultPortionGrams: 12,
    portionLabel: '1 cucharada (12g)'
  },
  {
    id: 'sunflower_seeds',
    name: 'Semillas de girasol peladas',
    category: 'fats_nuts',
    per100g: { calories: 584, protein: 20.8, carbs: 20.0, fat: 51.5 },
    defaultPortionGrams: 20,
    portionLabel: '2 cucharadas (20g)'
  },
  {
    id: 'butter',
    name: 'Manteca / Mantequilla',
    category: 'fats_nuts',
    per100g: { calories: 717, protein: 0.9, carbs: 0.1, fat: 81.1 },
    defaultPortionGrams: 10,
    portionLabel: '1 cucharadita colmada (10g)'
  },
  {
    id: 'coconut_oil',
    name: 'Aceite de coco',
    category: 'fats_nuts',
    per100g: { calories: 862, protein: 0, carbs: 0, fat: 100.0 },
    defaultPortionGrams: 10,
    portionLabel: '1 cucharada (10g)'
  },
  {
    id: 'olives',
    name: 'Aceitunas verdes / negras',
    category: 'fats_nuts',
    per100g: { calories: 145, protein: 1.0, carbs: 3.8, fat: 15.3 },
    defaultPortionGrams: 35,
    portionLabel: '8 aceitunas (35g)'
  },
  {
    id: 'tahini',
    name: 'Tahini (pasta de sésamo)',
    category: 'fats_nuts',
    per100g: { calories: 595, protein: 17.0, carbs: 21.2, fat: 53.8 },
    defaultPortionGrams: 15,
    portionLabel: '1 cucharada (15g)'
  },
  {
    id: 'pistachios',
    name: 'Pistachos pelados',
    category: 'fats_nuts',
    per100g: { calories: 562, protein: 20.2, carbs: 27.2, fat: 45.3 },
    defaultPortionGrams: 25,
    portionLabel: '1 puñado (25g)'
  },
  {
    id: 'dark_chocolate_85',
    name: 'Chocolate amargo 85% cacao',
    category: 'fats_nuts',
    per100g: { calories: 592, protein: 10.5, carbs: 19.0, fat: 49.0 },
    defaultPortionGrams: 20,
    portionLabel: '2 cuadraditos (20g)'
  },

  // =========================================================================
  // SUPLEMENTOS, CONDIMENTOS Y OTROS (11 ítems) -> Total = 138 alimentos
  // =========================================================================
  {
    id: 'whey_protein',
    name: 'Proteína Whey (polvo)',
    category: 'drinks_supplements',
    per100g: { calories: 380, protein: 80.0, carbs: 6.5, fat: 4.0 },
    defaultPortionGrams: 30,
    portionLabel: '1 scoop (30g)'
  },
  {
    id: 'pea_protein',
    name: 'Proteína vegetal de arveja',
    category: 'drinks_supplements',
    per100g: { calories: 372, protein: 78.0, carbs: 5.0, fat: 4.5 },
    defaultPortionGrams: 30,
    portionLabel: '1 scoop (30g)'
  },
  {
    id: 'honey',
    name: 'Miel pura de abeja',
    category: 'drinks_supplements',
    per100g: { calories: 304, protein: 0.3, carbs: 82.4, fat: 0 },
    defaultPortionGrams: 15,
    portionLabel: '1 cucharada (15g)'
  },
  {
    id: 'cocoa_powder',
    name: 'Cacao amargo en polvo 100%',
    category: 'drinks_supplements',
    per100g: { calories: 228, protein: 19.6, carbs: 57.9, fat: 13.7 },
    defaultPortionGrams: 10,
    portionLabel: '1 cucharada (10g)'
  },
  {
    id: 'tomato_sauce',
    name: 'Salsa de tomate natural / triturado',
    category: 'drinks_supplements',
    per100g: { calories: 29, protein: 1.3, carbs: 5.8, fat: 0.2 },
    defaultPortionGrams: 100,
    portionLabel: '1/2 taza (100g)'
  },
  {
    id: 'soy_sauce',
    name: 'Salsa de soja',
    category: 'drinks_supplements',
    per100g: { calories: 53, protein: 8.1, carbs: 4.9, fat: 0.1 },
    defaultPortionGrams: 15,
    portionLabel: '1 cucharada (15ml)'
  },
  {
    id: 'jam_fruit',
    name: 'Mermelada de frutas',
    category: 'drinks_supplements',
    per100g: { calories: 250, protein: 0.4, carbs: 63.0, fat: 0.1 },
    defaultPortionGrams: 20,
    portionLabel: '1 cucharada (20g)'
  },
  {
    id: 'coffee_black',
    name: 'Café espresso / americano solo',
    category: 'drinks_supplements',
    per100g: { calories: 2, protein: 0.1, carbs: 0.3, fat: 0 },
    defaultPortionGrams: 200,
    portionLabel: '1 taza (200ml)'
  },
  {
    id: 'orange_juice',
    name: 'Jugo de naranja exprimido',
    category: 'drinks_supplements',
    per100g: { calories: 45, protein: 0.7, carbs: 10.4, fat: 0.2 },
    defaultPortionGrams: 200,
    portionLabel: '1 vaso (200ml)'
  },
  {
    id: 'protein_bar',
    name: 'Barra de proteína estándar',
    category: 'drinks_supplements',
    per100g: { calories: 365, protein: 34.0, carbs: 33.0, fat: 11.0 },
    defaultPortionGrams: 55,
    portionLabel: '1 barra (55g)'
  },
  {
    id: 'mustard',
    name: 'Mostaza Dijon',
    category: 'drinks_supplements',
    per100g: { calories: 66, protein: 4.4, carbs: 5.3, fat: 3.3 },
    defaultPortionGrams: 15,
    portionLabel: '1 cucharada (15g)'
  },

  // =========================================================================
  // PLATOS PREPARADOS (ARGENTINA Y CLÁSICOS)
  // =========================================================================
  {
    id: 'meal_milanesa_carne_horno',
    name: 'Milanesa de carne al horno',
    category: 'prepared_meals',
    per100g: { calories: 215, protein: 20.5, carbs: 14.0, fat: 8.2 },
    defaultPortionGrams: 160,
    portionLabel: '1 milanesa mediana (160g)'
  },
  {
    id: 'meal_milanesa_carne_frita',
    name: 'Milanesa de carne frita',
    category: 'prepared_meals',
    per100g: { calories: 295, protein: 19.0, carbs: 15.5, fat: 17.5 },
    defaultPortionGrams: 160,
    portionLabel: '1 milanesa mediana (160g)'
  },
  {
    id: 'meal_milanesa_pollo_horno',
    name: 'Milanesa de pollo / Suprema al horno',
    category: 'prepared_meals',
    per100g: { calories: 198, protein: 21.8, carbs: 13.5, fat: 6.2 },
    defaultPortionGrams: 160,
    portionLabel: '1 milanesa mediana (160g)'
  },
  {
    id: 'meal_milanesa_pollo_frita',
    name: 'Milanesa de pollo / Suprema frita',
    category: 'prepared_meals',
    per100g: { calories: 278, protein: 20.0, carbs: 15.0, fat: 15.2 },
    defaultPortionGrams: 160,
    portionLabel: '1 milanesa mediana (160g)'
  },
  {
    id: 'meal_milanesa_napolitana',
    name: 'Milanesa a la napolitana',
    category: 'prepared_meals',
    per100g: { calories: 248, protein: 19.5, carbs: 12.5, fat: 13.2 },
    defaultPortionGrams: 240,
    portionLabel: '1 milanesa napolitana (240g)'
  },
  {
    id: 'meal_empanada_carne_horno',
    name: 'Empanada de carne (al horno)',
    category: 'prepared_meals',
    per100g: { calories: 256, protein: 10.5, carbs: 28.0, fat: 11.2 },
    defaultPortionGrams: 95,
    portionLabel: '1 empanada (95g)'
  },
  {
    id: 'meal_empanada_carne_frita',
    name: 'Empanada de carne (frita)',
    category: 'prepared_meals',
    per100g: { calories: 328, protein: 9.8, carbs: 27.5, fat: 19.8 },
    defaultPortionGrams: 95,
    portionLabel: '1 empanada (95g)'
  },
  {
    id: 'meal_empanada_jyq',
    name: 'Empanada de jamón y queso',
    category: 'prepared_meals',
    per100g: { calories: 272, protein: 11.8, carbs: 27.0, fat: 13.0 },
    defaultPortionGrams: 90,
    portionLabel: '1 empanada (90g)'
  },
  {
    id: 'meal_empanada_pollo',
    name: 'Empanada de pollo',
    category: 'prepared_meals',
    per100g: { calories: 242, protein: 11.2, carbs: 27.5, fat: 9.6 },
    defaultPortionGrams: 95,
    portionLabel: '1 empanada (95g)'
  },
  {
    id: 'meal_empanada_humita',
    name: 'Empanada de humita',
    category: 'prepared_meals',
    per100g: { calories: 235, protein: 6.5, carbs: 32.0, fat: 9.0 },
    defaultPortionGrams: 95,
    portionLabel: '1 empanada (95g)'
  },
  {
    id: 'meal_empanada_verdura',
    name: 'Empanada de verdura / espinaca',
    category: 'prepared_meals',
    per100g: { calories: 218, protein: 7.8, carbs: 26.5, fat: 8.8 },
    defaultPortionGrams: 95,
    portionLabel: '1 empanada (95g)'
  },
  {
    id: 'meal_empanada_queso_cebolla',
    name: 'Empanada de queso y cebolla',
    category: 'prepared_meals',
    per100g: { calories: 268, protein: 9.8, carbs: 28.0, fat: 13.0 },
    defaultPortionGrams: 90,
    portionLabel: '1 empanada (90g)'
  },
  {
    id: 'meal_pizza_muzzarella',
    name: 'Pizza de muzzarella',
    category: 'prepared_meals',
    per100g: { calories: 266, protein: 11.4, carbs: 31.0, fat: 10.6 },
    defaultPortionGrams: 115,
    portionLabel: '1 porción (115g)'
  },
  {
    id: 'meal_pizza_napolitana',
    name: 'Pizza napolitana (tomate y ajo)',
    category: 'prepared_meals',
    per100g: { calories: 245, protein: 10.5, carbs: 29.0, fat: 9.6 },
    defaultPortionGrams: 125,
    portionLabel: '1 porción (125g)'
  },
  {
    id: 'meal_pizza_fugazzeta',
    name: 'Pizza fugazzeta',
    category: 'prepared_meals',
    per100g: { calories: 274, protein: 11.2, carbs: 32.5, fat: 11.0 },
    defaultPortionGrams: 125,
    portionLabel: '1 porción (125g)'
  },
  {
    id: 'meal_pizza_jamon_morron',
    name: 'Pizza de jamón y morrones',
    category: 'prepared_meals',
    per100g: { calories: 258, protein: 12.2, carbs: 29.5, fat: 10.0 },
    defaultPortionGrams: 125,
    portionLabel: '1 porción (125g)'
  },
  {
    id: 'meal_faina',
    name: 'Fainá',
    category: 'prepared_meals',
    per100g: { calories: 232, protein: 7.4, carbs: 25.0, fat: 11.2 },
    defaultPortionGrams: 85,
    portionLabel: '1 porción (85g)'
  },
  {
    id: 'meal_choripan',
    name: 'Choripán completo (con chimichurri)',
    category: 'prepared_meals',
    per100g: { calories: 296, protein: 12.0, carbs: 25.5, fat: 16.2 },
    defaultPortionGrams: 190,
    portionLabel: '1 choripán (190g)'
  },
  {
    id: 'meal_sandwich_milanesa',
    name: 'Sándwich de milanesa completo',
    category: 'prepared_meals',
    per100g: { calories: 238, protein: 13.5, carbs: 26.0, fat: 8.8 },
    defaultPortionGrams: 280,
    portionLabel: '1 sándwich (280g)'
  },
  {
    id: 'meal_lomito_completo',
    name: 'Lomito completo (lomo, jamón, queso, huevo)',
    category: 'prepared_meals',
    per100g: { calories: 224, protein: 15.2, carbs: 19.5, fat: 9.4 },
    defaultPortionGrams: 340,
    portionLabel: '1 lomito (340g)'
  },
  {
    id: 'meal_sandwich_miga_jyq',
    name: 'Sándwich de miga de jamón y queso (triple)',
    category: 'prepared_meals',
    per100g: { calories: 285, protein: 12.2, carbs: 29.5, fat: 13.0 },
    defaultPortionGrams: 95,
    portionLabel: '1 triple (95g)'
  },
  {
    id: 'meal_tostado_jyq',
    name: 'Tostado / Carlitos de jamón y queso',
    category: 'prepared_meals',
    per100g: { calories: 288, protein: 13.0, carbs: 30.5, fat: 12.5 },
    defaultPortionGrams: 140,
    portionLabel: '1 tostado (140g)'
  },
  {
    id: 'meal_hamburguesa_completa',
    name: 'Hamburguesa casera completa (con pan y queso)',
    category: 'prepared_meals',
    per100g: { calories: 248, protein: 13.8, carbs: 21.5, fat: 11.8 },
    defaultPortionGrams: 230,
    portionLabel: '1 hamburguesa (230g)'
  },
  {
    id: 'meal_pancho',
    name: 'Pancho / Superpancho',
    category: 'prepared_meals',
    per100g: { calories: 278, protein: 10.2, carbs: 25.0, fat: 15.2 },
    defaultPortionGrams: 115,
    portionLabel: '1 pancho (115g)'
  },
  {
    id: 'meal_pastel_papa',
    name: 'Pastel de papa (carne y puré)',
    category: 'prepared_meals',
    per100g: { calories: 148, protein: 9.2, carbs: 14.5, fat: 5.8 },
    defaultPortionGrams: 320,
    portionLabel: '1 porción (320g)'
  },
  {
    id: 'meal_guiso_lentejas',
    name: 'Guiso de lentejas criollo',
    category: 'prepared_meals',
    per100g: { calories: 132, protein: 7.8, carbs: 15.5, fat: 4.2 },
    defaultPortionGrams: 350,
    portionLabel: '1 plato hondo (350g)'
  },
  {
    id: 'meal_locro',
    name: 'Locro criollo',
    category: 'prepared_meals',
    per100g: { calories: 142, protein: 8.5, carbs: 14.8, fat: 5.4 },
    defaultPortionGrams: 380,
    portionLabel: '1 plato hondo (380g)'
  },
  {
    id: 'meal_polenta_tuco',
    name: 'Polenta con tuco y queso',
    category: 'prepared_meals',
    per100g: { calories: 118, protein: 5.2, carbs: 14.2, fat: 4.4 },
    defaultPortionGrams: 320,
    portionLabel: '1 plato (320g)'
  },
  {
    id: 'meal_fideos_bolognesa',
    name: 'Fideos con tuco / salsa bolognesa',
    category: 'prepared_meals',
    per100g: { calories: 144, protein: 7.6, carbs: 19.5, fat: 3.8 },
    defaultPortionGrams: 300,
    portionLabel: '1 plato (300g)'
  },
  {
    id: 'meal_fideos_manteca_queso',
    name: 'Fideos con manteca y queso rallado',
    category: 'prepared_meals',
    per100g: { calories: 178, protein: 6.8, carbs: 23.0, fat: 6.5 },
    defaultPortionGrams: 260,
    portionLabel: '1 plato (260g)'
  },
  {
    id: 'meal_noquis_fileto',
    name: 'Ñoquis de papa con salsa fileto',
    category: 'prepared_meals',
    per100g: { calories: 146, protein: 4.2, carbs: 26.5, fat: 2.5 },
    defaultPortionGrams: 300,
    portionLabel: '1 plato (300g)'
  },
  {
    id: 'meal_ravioles_salsa_rosa',
    name: 'Ravioles de ricota con salsa rosa',
    category: 'prepared_meals',
    per100g: { calories: 186, protein: 7.4, carbs: 23.5, fat: 6.8 },
    defaultPortionGrams: 280,
    portionLabel: '1 plato (280g)'
  },
  {
    id: 'meal_sorrentinos_jyq',
    name: 'Sorrentinos de jamón y queso con salsa',
    category: 'prepared_meals',
    per100g: { calories: 204, protein: 9.2, carbs: 24.0, fat: 7.8 },
    defaultPortionGrams: 280,
    portionLabel: '1 plato / 6 unidades (280g)'
  },
  {
    id: 'meal_lasagna_carne',
    name: 'Lasagna de carne y verdura',
    category: 'prepared_meals',
    per100g: { calories: 168, protein: 10.2, carbs: 15.0, fat: 7.4 },
    defaultPortionGrams: 320,
    portionLabel: '1 porción (320g)'
  },
  {
    id: 'meal_canelones_verdura',
    name: 'Canelones de verdura y ricota con salsa blanca',
    category: 'prepared_meals',
    per100g: { calories: 142, protein: 7.0, carbs: 14.5, fat: 6.2 },
    defaultPortionGrams: 280,
    portionLabel: '2 canelones (280g)'
  },
  {
    id: 'meal_arroz_con_pollo',
    name: 'Arroz con pollo casero',
    category: 'prepared_meals',
    per100g: { calories: 148, protein: 10.5, carbs: 17.5, fat: 3.8 },
    defaultPortionGrams: 320,
    portionLabel: '1 plato (320g)'
  },
  {
    id: 'meal_risotto',
    name: 'Risotto de hongos / queso',
    category: 'prepared_meals',
    per100g: { calories: 162, protein: 5.4, carbs: 22.5, fat: 5.4 },
    defaultPortionGrams: 280,
    portionLabel: '1 plato (280g)'
  },
  {
    id: 'meal_tarta_jyq',
    name: 'Tarta de jamón y queso',
    category: 'prepared_meals',
    per100g: { calories: 268, protein: 12.0, carbs: 21.5, fat: 14.8 },
    defaultPortionGrams: 180,
    portionLabel: '1 porción (180g)'
  },
  {
    id: 'meal_tarta_pascualina',
    name: 'Tarta pascualina (espinaca y huevo)',
    category: 'prepared_meals',
    per100g: { calories: 192, protein: 8.6, carbs: 18.5, fat: 9.2 },
    defaultPortionGrams: 200,
    portionLabel: '1 porción (200g)'
  },
  {
    id: 'meal_tarta_zapallitos',
    name: 'Tarta de zapallitos',
    category: 'prepared_meals',
    per100g: { calories: 175, protein: 7.4, carbs: 17.5, fat: 8.4 },
    defaultPortionGrams: 200,
    portionLabel: '1 porción (200g)'
  },
  {
    id: 'meal_tarta_pollo',
    name: 'Tarta de pollo',
    category: 'prepared_meals',
    per100g: { calories: 226, protein: 12.8, carbs: 20.5, fat: 10.2 },
    defaultPortionGrams: 200,
    portionLabel: '1 porción (200g)'
  },
  {
    id: 'meal_tortilla_papa',
    name: 'Tortilla de papa (española)',
    category: 'prepared_meals',
    per100g: { calories: 158, protein: 6.2, carbs: 14.5, fat: 8.4 },
    defaultPortionGrams: 200,
    portionLabel: '1 porción (200g)'
  },
  {
    id: 'meal_revuelto_gramajo',
    name: 'Revuelto gramajo',
    category: 'prepared_meals',
    per100g: { calories: 196, protein: 9.8, carbs: 15.0, fat: 10.8 },
    defaultPortionGrams: 250,
    portionLabel: '1 plato (250g)'
  },
  {
    id: 'meal_bife_caballo',
    name: 'Bife a caballo (bife con huevo frito)',
    category: 'prepared_meals',
    per100g: { calories: 198, protein: 22.0, carbs: 0.4, fat: 11.8 },
    defaultPortionGrams: 240,
    portionLabel: '1 bife + 1 huevo (240g)'
  },
  {
    id: 'meal_pollo_horno_papas',
    name: 'Pollo al horno con papas',
    category: 'prepared_meals',
    per100g: { calories: 154, protein: 13.5, carbs: 11.5, fat: 6.0 },
    defaultPortionGrams: 350,
    portionLabel: '1 plato (350g)'
  },
  {
    id: 'meal_ensalada_cesar',
    name: 'Ensalada César con pollo',
    category: 'prepared_meals',
    per100g: { calories: 145, protein: 12.0, carbs: 6.5, fat: 8.0 },
    defaultPortionGrams: 280,
    portionLabel: '1 bowl (280g)'
  },
  {
    id: 'meal_ensalada_rusa',
    name: 'Ensalada rusa (papa, zanahoria, arvejas, mayonesa)',
    category: 'prepared_meals',
    per100g: { calories: 136, protein: 2.4, carbs: 14.0, fat: 7.8 },
    defaultPortionGrams: 180,
    portionLabel: '1 porción (180g)'
  },
  {
    id: 'meal_ensalada_mixta',
    name: 'Ensalada mixta (lechuga, tomate, cebolla)',
    category: 'prepared_meals',
    per100g: { calories: 28, protein: 1.2, carbs: 4.5, fat: 0.4 },
    defaultPortionGrams: 180,
    portionLabel: '1 bowl (180g)'
  },
  {
    id: 'meal_pure_papas',
    name: 'Puré de papas (con leche y manteca)',
    category: 'prepared_meals',
    per100g: { calories: 112, protein: 2.2, carbs: 16.5, fat: 4.2 },
    defaultPortionGrams: 200,
    portionLabel: '1 porción (200g)'
  },
  {
    id: 'meal_pure_calabaza',
    name: 'Puré de calabaza / zapallo',
    category: 'prepared_meals',
    per100g: { calories: 48, protein: 1.4, carbs: 9.2, fat: 0.8 },
    defaultPortionGrams: 200,
    portionLabel: '1 porción (200g)'
  },
  {
    id: 'meal_papas_fritas',
    name: 'Papas fritas',
    category: 'prepared_meals',
    per100g: { calories: 312, protein: 3.4, carbs: 41.4, fat: 14.7 },
    defaultPortionGrams: 150,
    portionLabel: '1 porción mediana (150g)'
  },
  {
    id: 'meal_papas_horno',
    name: 'Papas al horno (con aceite)',
    category: 'prepared_meals',
    per100g: { calories: 134, protein: 2.3, carbs: 22.5, fat: 4.0 },
    defaultPortionGrams: 180,
    portionLabel: '1 porción (180g)'
  },
  {
    id: 'meal_matambre_pizza',
    name: 'Matambre a la pizza',
    category: 'prepared_meals',
    per100g: { calories: 252, protein: 21.5, carbs: 3.2, fat: 17.2 },
    defaultPortionGrams: 220,
    portionLabel: '1 porción (220g)'
  },
  {
    id: 'meal_vitel_tone',
    name: 'Vitel toné (peceto con salsa)',
    category: 'prepared_meals',
    per100g: { calories: 218, protein: 18.5, carbs: 2.0, fat: 15.2 },
    defaultPortionGrams: 180,
    portionLabel: '1 porción (180g)'
  },
  {
    id: 'meal_humita_olla',
    name: 'Humita en olla / chala',
    category: 'prepared_meals',
    per100g: { calories: 124, protein: 3.8, carbs: 19.5, fat: 3.8 },
    defaultPortionGrams: 260,
    portionLabel: '1 plato (260g)'
  },
  {
    id: 'meal_carbonada',
    name: 'Carbonada criolla',
    category: 'prepared_meals',
    per100g: { calories: 118, protein: 7.2, carbs: 14.5, fat: 3.6 },
    defaultPortionGrams: 350,
    portionLabel: '1 plato hondo (350g)'
  },
  {
    id: 'meal_sopa_verduras',
    name: 'Sopa de verduras casera',
    category: 'prepared_meals',
    per100g: { calories: 36, protein: 1.4, carbs: 6.2, fat: 0.6 },
    defaultPortionGrams: 300,
    portionLabel: '1 plato hondo (300g)'
  },
  {
    id: 'meal_medialuna_manteca',
    name: 'Medialuna de manteca',
    category: 'prepared_meals',
    per100g: { calories: 386, protein: 7.5, carbs: 51.0, fat: 17.0 },
    defaultPortionGrams: 45,
    portionLabel: '1 medialuna (45g)'
  },
  {
    id: 'meal_medialuna_grasa',
    name: 'Medialuna de grasa',
    category: 'prepared_meals',
    per100g: { calories: 408, protein: 8.0, carbs: 49.0, fat: 20.0 },
    defaultPortionGrams: 40,
    portionLabel: '1 medialuna (40g)'
  },
  {
    id: 'meal_factura_ddl',
    name: 'Factura con dulce de leche / pastelera',
    category: 'prepared_meals',
    per100g: { calories: 365, protein: 6.8, carbs: 53.0, fat: 14.2 },
    defaultPortionGrams: 60,
    portionLabel: '1 factura (60g)'
  },
  {
    id: 'meal_alfajor_choco',
    name: 'Alfajor de dulce de leche (baño de chocolate)',
    category: 'prepared_meals',
    per100g: { calories: 412, protein: 6.2, carbs: 61.5, fat: 15.8 },
    defaultPortionGrams: 55,
    portionLabel: '1 alfajor (55g)'
  },
  {
    id: 'meal_alfajor_maicena',
    name: 'Alfajor de maicena',
    category: 'prepared_meals',
    per100g: { calories: 388, protein: 5.5, carbs: 63.0, fat: 12.8 },
    defaultPortionGrams: 50,
    portionLabel: '1 alfajor mediano (50g)'
  },
  {
    id: 'meal_flan_ddl',
    name: 'Flan casero con dulce de leche',
    category: 'prepared_meals',
    per100g: { calories: 196, protein: 5.4, carbs: 32.0, fat: 5.2 },
    defaultPortionGrams: 150,
    portionLabel: '1 porción (150g)'
  },
  {
    id: 'meal_chocotorta',
    name: 'Chocotorta',
    category: 'prepared_meals',
    per100g: { calories: 348, protein: 6.4, carbs: 44.0, fat: 16.5 },
    defaultPortionGrams: 120,
    portionLabel: '1 porción (120g)'
  },
  {
    id: 'meal_sushi_rolls',
    name: 'Sushi rolls variados (salmón / palta / queso)',
    category: 'prepared_meals',
    per100g: { calories: 162, protein: 6.8, carbs: 24.5, fat: 4.2 },
    defaultPortionGrams: 220,
    portionLabel: '8 piezas (220g)'
  },
  {
    id: 'meal_tacos_carne',
    name: 'Tacos de carne con vegetales',
    category: 'prepared_meals',
    per100g: { calories: 198, protein: 12.2, carbs: 19.0, fat: 8.2 },
    defaultPortionGrams: 110,
    portionLabel: '1 taco (110g)'
  },
  {
    id: 'meal_burrito_pollo',
    name: 'Burrito de pollo, arroz y vegetales',
    category: 'prepared_meals',
    per100g: { calories: 184, protein: 11.4, carbs: 22.5, fat: 5.4 },
    defaultPortionGrams: 300,
    portionLabel: '1 burrito (300g)'
  },
  {
    id: 'meal_poke_salmon',
    name: 'Poke bowl de salmón, arroz y palta',
    category: 'prepared_meals',
    per100g: { calories: 156, protein: 9.8, carbs: 17.0, fat: 5.6 },
    defaultPortionGrams: 340,
    portionLabel: '1 bowl (340g)'
  }
];

export const INITIAL_CUSTOM_DISHES: CustomDish[] = [
  {
    id: 'dish_bowl_mediterraneo',
    name: 'Bowl Mediterráneo de Pollo',
    description: 'Pechuga grillada, quinoa tibia, tomates cherry, palta y oliva.',
    servings: 1,
    createdAt: '2026-11-01T10:00:00.000Z',
    ingredients: [
      { foodId: 'chicken_breast_cooked', grams: 160 },
      { foodId: 'quinoa_cooked', grams: 150 },
      { foodId: 'cherry_tomatoes', grams: 80 },
      { foodId: 'cucumber', grams: 60 },
      { foodId: 'avocado', grams: 60 },
      { foodId: 'olive_oil', grams: 8 }
    ]
  },
  {
    id: 'dish_overnight_oats',
    name: 'Avena Proteica con Arándanos',
    description: 'Desayuno saciante preparado con yogur griego, avena y chía.',
    servings: 1,
    createdAt: '2026-11-02T08:00:00.000Z',
    ingredients: [
      { foodId: 'oats_rolled', grams: 50 },
      { foodId: 'greek_yogurt_0', grams: 150 },
      { foodId: 'milk_semi', grams: 100 },
      { foodId: 'blueberries', grams: 70 },
      { foodId: 'chia_seeds', grams: 12 },
      { foodId: 'honey', grams: 10 }
    ]
  },
  {
    id: 'dish_tostadas_palta_huevo',
    name: 'Tostadas Masa Madre, Palta y Huevo',
    description: 'Clásico desayuno equilibrado en grasas buenas y proteína.',
    servings: 1,
    createdAt: '2026-11-03T09:00:00.000Z',
    ingredients: [
      { foodId: 'sourdough_bread', grams: 75 },
      { foodId: 'egg_whole', grams: 110 },
      { foodId: 'avocado', grams: 70 },
      { foodId: 'cherry_tomatoes', grams: 50 }
    ]
  },
  {
    id: 'dish_salmon_batata',
    name: 'Salmón al Horno con Batata y Brócoli',
    description: 'Cena rica en Omega-3 y carbohidratos complejos.',
    servings: 1,
    createdAt: '2026-11-04T20:00:00.000Z',
    ingredients: [
      { foodId: 'salmon', grams: 150 },
      { foodId: 'sweet_potato', grams: 180 },
      { foodId: 'broccoli', grams: 130 },
      { foodId: 'olive_oil', grams: 7 }
    ]
  },
  {
    id: 'dish_pancakes_avena',
    name: 'Panqueques de Avena, Banana y Clara',
    description: 'Receta rinde 2 porciones ideales para merienda o post-entreno.',
    servings: 2,
    createdAt: '2026-11-05T17:00:00.000Z',
    ingredients: [
      { foodId: 'oats_rolled', grams: 80 },
      { foodId: 'banana', grams: 120 },
      { foodId: 'egg_whole', grams: 55 },
      { foodId: 'egg_white', grams: 100 },
      { foodId: 'whey_protein', grams: 25 }
    ]
  }
];
