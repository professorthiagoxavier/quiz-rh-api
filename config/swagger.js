const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Quiz RH',
      version: '1.0.0',
      description: 'API RESTful para sistema de quiz de Recursos Humanos',
      contact: {
        name: 'Desenvolvedor',
        email: 'dev@example.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      schemas: {
        Categoria: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único da categoria'
            },
            nome: {
              type: 'string',
              description: 'Nome da categoria',
              example: 'Gestão de Pessoas'
            },
            descricao: {
              type: 'string',
              description: 'Descrição da categoria',
              example: 'Perguntas sobre gestão de recursos humanos'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação'
            }
          },
          required: ['nome']
        },
        Pergunta: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único da pergunta'
            },
            categoria_id: {
              type: 'integer',
              description: 'ID da categoria'
            },
            categoria_nome: {
              type: 'string',
              description: 'Nome da categoria'
            },
            texto: {
              type: 'string',
              description: 'Texto da pergunta',
              example: 'Qual é o principal objetivo do RH?'
            },
            dificuldade: {
              type: 'string',
              enum: ['facil', 'medio', 'dificil'],
              description: 'Nível de dificuldade da pergunta'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação'
            }
          },
          required: ['texto', 'dificuldade']
        },
        Resposta: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único da resposta'
            },
            pergunta_id: {
              type: 'integer',
              description: 'ID da pergunta'
            },
            pergunta_texto: {
              type: 'string',
              description: 'Texto da pergunta'
            },
            texto: {
              type: 'string',
              description: 'Texto da resposta',
              example: 'Gerenciar pessoas'
            },
            correta: {
              type: 'boolean',
              description: 'Se a resposta está correta',
              default: false
            }
          },
          required: ['pergunta_id', 'texto']
        },
        Usuario: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do usuário'
            },
            nome: {
              type: 'string',
              description: 'Nome do usuário',
              example: 'João Silva'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário',
              example: 'joao@email.com'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação'
            }
          },
          required: ['nome', 'email']
        },
        ResultadoQuiz: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do resultado'
            },
            usuario_id: {
              type: 'integer',
              description: 'ID do usuário'
            },
            usuario_nome: {
              type: 'string',
              description: 'Nome do usuário'
            },
            pontuacao: {
              type: 'integer',
              description: 'Pontuação obtida',
              example: 8
            },
            total_perguntas: {
              type: 'integer',
              description: 'Total de perguntas do quiz',
              example: 10
            },
            data_quiz: {
              type: 'string',
              format: 'date-time',
              description: 'Data do quiz'
            }
          },
          required: ['usuario_id', 'pontuacao', 'total_perguntas']
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Erro na operação'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              description: 'Dados da resposta'
            },
            message: {
              type: 'string',
              example: 'Operação realizada com sucesso'
            }
          }
        }
      },
      responses: {
        NotFound: {
          description: 'Recurso não encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ValidationError: {
          description: 'Erro de validação',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ServerError: {
          description: 'Erro interno do servidor',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  apis: ['./controllers/*.js', './server.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs; 