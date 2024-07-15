// src/fetchPrompt.ts
import axios from 'axios';

interface AIResponse {
  choices: { text: string }[];
}

export const fetchPrompt = async (prompt: string): Promise<string> => {
  console.log('we are In fetchPrompt : ');
  const apiKey = "kkbIhu1SZ3OCeGUNhaRETCwUlqYH7fjv";

  const url = "https://api.mistral.ai/v1/chat/completions";

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
    console.log('Sending request to AI API with payload:', JSON.stringify(payload, null, 2));
    const response = await axios.post<AIResponse>(url, payload, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Received response from AI API:', JSON.stringify(response.data, null, 2));
    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].text.trim();
    } else {
      throw new Error('No response from the AI model');
    }
  } catch (error: unknown) {
    console.error('Error fetching prompt:', error);
    if (error instanceof Error) {
      throw new Error(`Error fetching prompt: ${error.message}`);
    } else {
      throw new Error('Unknown error occurred');
    }
  }
};
