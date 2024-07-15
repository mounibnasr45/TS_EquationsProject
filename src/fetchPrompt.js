"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPrompt = void 0;
// src/fetchPrompt.ts
const axios_1 = __importDefault(require("axios"));
const fetchPrompt = async (prompt) => {
    const apiKey = "your-api-key";
    const url = "your-api-endpoint";
    const payload = {
        model: "open-mixtral-8x22b-2404",
        messages: [
            {
                role: "user",
                content: `
        -Role: You are a highly specialized data analyst with proficiency in TypeScript.
        -Task: Your task is to analyze and extract variable names and their corresponding values from the provided equations. These equations are a mix of logical and mathematical expressions that may be quasi-complete. You are to output the result in a structured format using TypeScript interfaces. For each variable, match it with the system variables provided, and add the properties (same from the system variable list) of the system variables to the matched variable. Other variables will only have 'name' and 'type' properties, where the 'type' should be logically inferred (STRING/INT/FLOAT).
        -Output: Provide only the TypeScript code in the specified format. Refrain from including any extra messages, notes, or explanations.
        -System variables to possibly match:
          export const automaticVariables: EquationVariable[] = [
            {
              name: 'width',
              type: VariableType.AUTO,
              unit: Unit.CM,
            },
            {
              name: 'height',
              type: VariableType.AUTO,
              unit: Unit.CM,
            },
            {
              name: 'depth',
              type: VariableType.AUTO,
              unit: Unit.CM,
            },
            {
              name: 'volume',
              type: VariableType.AUTO,
              unit: Unit.CM3,
            },
            {
              name: 'weight',
              type: VariableType.AUTO,
              unit: Unit.G,
            },
            {
              name: 'minimum_bounding_box',
              type: VariableType.AUTO,
              unit: Unit.CM3,
            },
            {
              name: 'convex_hull',
              type: VariableType.AUTO,
              unit: Unit.CM3,
            },
            {
              name: 'total_print_area',
              type: VariableType.AUTO,
              unit: Unit.CM2,
            },
            {
              name: 'number_of_layers',
              type: VariableType.AUTO,
            },
            {
              name: 'material_price',
              type: VariableType.AUTO,
              unit: Unit.KG,
            },
          ];
          -Declared Interfaces to use:
          export enum VariableType {
            CONSTANT = 'constant',
            AUTO = 'auto',
            SELECT = 'select',
            OPERATOR = 'operator',
          }

          export interface VariableOption {
            refer: string;
            name: string;
            priceMultiplier: number;
            isDefault: boolean;
            created: Date;
          }

          export interface EquationVariable {
            name: string;
            type: VariableType;
            unit?: string;
            value?: number;
            options?: VariableOption[];
            colorHex?: string;
          }
          -Use Case Example :
            - Equation : Volume (cm³) * Material Price (Price/kg) * ( infill * precision )
            - Output: 
              const equationVariables: { [key: string]: EquationVariable } = {
                volume: {
                  name: 'volume',
                  type: VariableType.AUTO,
                  unit: 'cm3',
                  value: 92571.01,
                  colorHex: '#311DC5',
                },
                '*': {
                  name: '*',
                  type: VariableType.OPERATOR,
                  colorHex: 'black',
                },
                material_price: {
                  name: 'material_price',
                  type: VariableType.AUTO,
                  unit: 'kg',
                  value: 2,
                  colorHex: '#225134',
                },
                infill: {
                  name: 'infill',
                  type: VariableType.SELECT,
                  options: [
                    {
                      refer: 'infill',
                      name: '10%',
                      priceMultiplier: 0.1,
                      isDefault: false,
                      created: new Date('2024-07-08T10:18:27.386Z'),
                    },
                    {
                      refer: 'infill',
                      name: '20%',
                      priceMultiplier: 0.2,
                      isDefault: true,
                      created: new Date('2024-07-08T10:18:27.386Z'),
                    },
                  ],
                  colorHex: '#C22134',
                },
                precision: {
                  name: 'precision',
                  type: VariableType.SELECT,
                  options: [
                    {
                      refer: 'precision',
                      name: 'high',
                      priceMultiplier: 1.5,
                      isDefault: true,
                      created: new Date('2024-07-08T10:18:27.386Z'),
                    },
                    {
                      refer: 'precision',
                      name: 'low',
                      priceMultiplier: 1.0,
                      isDefault: false,
                      created: new Date('2024-07-08T10:18:27.386Z'),
                    },
                  ],
                  colorHex: '#22A54C',
                },
              };
          `
            }
        ]
    };
    try {
        const response = await axios_1.default.post(url, payload, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.data && response.data.choices && response.data.choices.length > 0) {
            return response.data.choices[0].text;
        }
        else {
            throw new Error('No response from the AI model');
        }
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error fetching prompt: ${error.message}`);
        }
        else {
            throw new Error('Unknown error occurred');
        }
    }
};
exports.fetchPrompt = fetchPrompt;
