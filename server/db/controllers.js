const pool = require("./db.js");



exports.getProducts = (req, res) => {
  //product needs features too
  console.log("REQPARAMS", req.query.page);
  let page = req.query.page || 1;
  let count = req.query.count || 5;
  let offset = page * count - count;
  console.log("GET REQUEST");
  pool
    .query(`Select * FROM product OFFSET ${offset} LIMIT ${count}`)
    .then((data) => {
      res.send(data.rows);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};
exports.getOneProduct = (req, res) => {
  let id = req.params.product_id;
  let getOneProductQuery = `SELECT json_build_object(
    'id', p.id, 'name', p.name, 'slogan', p.slogan, 'description', p.description, 'category', p.category, 'default_price', p.default_price::text,
     'features', (
        SELECT json_agg(row_to_json(features))
          FROM (SELECT feature, features.value FROM features WHERE product_id = ${id}) AS features)) AS product
    FROM product p WHERE id = ${id}`
  ;
  pool
    .query(getOneProductQuery)
    .then((data) => {
      console.log(data.rows);
      res.send(data.rows[0].product);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};
exports.getProductStyle = (req, res) => {
  let id = req.params.product_id
  let styleQuery = `Select json_build_object(
    'product_id',
    '${id}',
    'results',
    (Select json_agg(a) from (
      select id as style_id,
      name, original_price::text, coalesce(sale_price::text, '0') as sale_price, default_style::bool as "default?", coalesce (sp.photos, '[]') AS photos,	(SELECT json_object_agg(quantitysize.id, quantitysize.details) from
    (SELECT sku.id, json_build_object('quantity', sku.quantity, 'size', sku.size) as details from
    (select id as style_id,
          name, original_price::text, coalesce(sale_price::text, '0') as sale_price, default_style::bool as "default?", coalesce (sp.photos, '[]') AS photos
          from style s
          LEFT JOIN LATERAL
          (SELECT json_agg(json_build_object('thumbnail_url', sp.thumbnail_url, 'url', sp.url)) as photos from photos sp where sp.styleid = s.id) sp on true
          where s.productid = ${id}) as styles
          LEFT JOIN (
          SELECT * FROM SKU
          ) as sku ON styles.style_id = sku.styleid
          group by sku.quantity, sku.size, sku.id) as quantitysize) as skus
      from style s
      LEFT JOIN LATERAL
      (SELECT json_agg(json_build_object('thumbnail_url', sp.thumbnail_url, 'url', sp.url)) as photos from photos sp where sp.styleid = s.id) sp on true
        where s.productid = ${id}) a)
  ) as results;`
  pool
  .query(styleQuery)
  .then((data) => {
    console.log(data.rows);
    res.send(data.rows[0].results);
  })
  .catch((err) => {
    console.log(err);
    res.send(err);
  });
//style needs info from photos table and skus
}
exports.getRelated = (req, res) => {
  let id = req.params.product_id
  console.log({id})
  let relatedQuery = `SELECT json_agg(related.related_id) AS related FROM related WHERE product_id=${id}`
  pool
  .query(relatedQuery)
  .then((data) => {
    console.log(data.rows);
    res.send(data.rows[0].related);
  })
  .catch((err) => {
    console.log(err);
    res.send(err);
  });
}

