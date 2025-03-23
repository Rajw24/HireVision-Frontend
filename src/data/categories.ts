export interface Category {
  id: string;
  name: string;
  description: string;
  displayOnHome?: boolean;
}

export const categories: Category[] = [
  {
    id: 'Random',
    name: 'General Aptitude',
    description: 'Numbers, Arithmetic, Percentages...',
    displayOnHome: true
  },
  {
    id: 'MixtureAndAlligation',
    name: 'Mixture and Alligation topic',
    description: 'Mixture of two or more entities...',
    displayOnHome: true
  },
  {
    id: 'Age',
    name: 'Age Problems',
    description: 'Problems based on age...',
    displayOnHome: true
},
  {
    id: 'PermutationAndCombination',
    name: 'Permutation And Combination Problems',
    description: 'Problems based on permutation and combination...',
    displayOnHome: true
  },
  {
    id: 'ProfitAndLoss',
    name: 'Profit and Loss Problems',
    description: 'Problems based on profit and loss...',
    displayOnHome: true
  },
  {
    id: 'PipesAndCisterns',
    name: 'Pipes and Cisterns Problems',
    description: 'Problems based on pipes and cisterns...',
    displayOnHome: true
  },
  {
    id: 'SpeedTimeDistance',
    name: 'Speed Time Distance Problems',
    description: 'Problems based on speed time distance...',
    displayOnHome: true
  },
  {
    id: 'Calendar',
    name: 'Calendar Problems',
    description: 'Problems based on calendar...',
    displayOnHome: true
  },
  {
    id: 'SimpleInterest',
    name: 'Simple Interest Problems',
    description: 'Problems based on simple interest...',
    displayOnHome: true
  }
];
