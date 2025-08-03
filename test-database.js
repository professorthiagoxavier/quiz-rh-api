const pool = require('./config/database');

async function testDatabaseConnection() {
  console.log('🔍 Testando conexão com o banco de dados...');
  console.log('📋 Configurações:');
  console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`   Port: ${process.env.DB_PORT || 5432}`);
  console.log(`   Database: ${process.env.DB_NAME || 'quiz_rh'}`);
  console.log(`   User: ${process.env.DB_USER}`);
  console.log(`   Password: ${process.env.DB_PASSWORD ? '***' : 'não definida'}`);
  console.log('');

  try {
    // Testar conexão
    const client = await pool.connect();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Testar query simples
    const result = await client.query('SELECT NOW() as current_time, version() as postgres_version');
    console.log('✅ Query de teste executada com sucesso!');
    console.log(`   Hora atual: ${result.rows[0].current_time}`);
    console.log(`   Versão PostgreSQL: ${result.rows[0].postgres_version.split(' ')[0]} ${result.rows[0].postgres_version.split(' ')[1]}`);
    
    // Verificar se as tabelas existem
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('categorias', 'perguntas', 'respostas', 'usuarios', 'resultados_quiz')
      ORDER BY table_name
    `);
    
    console.log('');
    console.log('📊 Tabelas encontradas:');
    if (tablesResult.rows.length === 0) {
      console.log('   ❌ Nenhuma tabela encontrada!');
      console.log('   💡 Execute o script database.sql para criar as tabelas');
    } else {
      tablesResult.rows.forEach(row => {
        console.log(`   ✅ ${row.table_name}`);
      });
    }
    
    // Contar registros em cada tabela
    if (tablesResult.rows.length > 0) {
      console.log('');
      console.log('📈 Contagem de registros:');
      for (const table of tablesResult.rows) {
        try {
          const countResult = await client.query(`SELECT COUNT(*) as count FROM ${table.table_name}`);
          console.log(`   ${table.table_name}: ${countResult.rows[0].count} registros`);
        } catch (error) {
          console.log(`   ${table.table_name}: Erro ao contar registros`);
        }
      }
    }
    
    client.release();
    console.log('');
    console.log('🎉 Teste de conexão concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro na conexão com o banco de dados:');
    console.error(`   ${error.message}`);
    console.log('');
    console.log('🔧 Possíveis soluções:');
    console.log('   1. Verifique se o PostgreSQL está rodando');
    console.log('   2. Verifique as credenciais no arquivo .env');
    console.log('   3. Verifique se o banco "quiz_rh" existe');
    console.log('   4. Verifique se o usuário tem permissões');
    console.log('');
    console.log('📝 Comandos úteis:');
    console.log('   # Criar banco de dados');
    console.log('   createdb quiz_rh');
    console.log('');
    console.log('   # Conectar ao PostgreSQL');
    console.log('   psql -U meuusuario -d quiz_rh');
    console.log('');
    console.log('   # Executar script SQL');
    console.log('   psql -U meuusuario -d quiz_rh -f database.sql');
  } finally {
    await pool.end();
  }
}

// Executar teste
testDatabaseConnection(); 