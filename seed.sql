-- Cole e execute isso no SQL Editor do Supabase
-- (apenas na primeira vez, para popular os produtos iniciais)

insert into produtos (name, description, category, price, unit, emoji, image, stock, ordem) values
('Mesa Bistrô Redonda',   'Mesa bistrô com tampo redondo, perfeita para lounges e coquetéis.',          'mesas',        45,  '/diária',    '🪑',  '', null, 1),
('Mesa Posta 6 Lugares',  'Mesa retangular com toalha inclusa, ideal para 6 pessoas.',                  'mesas',        120, '/diária',    '🪑',  '', null, 2),
('Cadeira Tiffany',       'Cadeira Tiffany transparente, elegante para qualquer tema de festa.',        'mesas',        12,  '/un/diária', '🪑',  '', null, 3),
('Painel Florido',        'Painel com flores artificiais 2x2m, ideal para fotos e cenário de festa.',   'paineis',      180, '/diária',    '🖼️', '', null, 4),
('Painel de Balões',      'Painel com estrutura para balões coloridos, montado no local do evento.',    'paineis',      150, '/diária',    '🖼️', '', null, 5),
('Painel Ripado',         'Painel ripado em madeira clara, estilo rústico chic para qualquer tema.',    'paineis',      200, '/diária',    '🖼️', '', null, 6),
('Kit Mesa Posta Completa','Toalha, caminho de mesa, porta-guardanapo e vela. Basta montar!',          'pegue-e-monte', 85, '/kit',       '',   '', null, 7),
('Kit Cantinho do Bolo',  'Mesinha, toalha, faqueiro decorativo e arranjo floral. Pronto para usar!',  'pegue-e-monte',110, '/kit',       '🎀', '', null, 8),
('Kit Lounge Externo',    'Tapete, puff, mesinha de centro e lanternas. Crie um cantinho aconchegante.','pegue-e-monte',220, '/kit',       '🎀', '', null, 9),
('Arranjo de Balões',     'Arranjo com balões coloridos ou temáticos, entregue inflado no local.',      'decoracao',    60,  '/arranjo',   '🎊', '', null, 10),
('Coluna de Balões',      'Coluna de balões 1,5m de altura, ideal para entrada ou palco do evento.',   'decoracao',    90,  '/unidade',   '🎊', '', null, 11),
('Varal de Luzes',        'Varal de luzes LED 5m, cria ambiente intimista e romântico para o evento.', 'decoracao',    35,  '/diária',    '🎊', '', null, 12);
