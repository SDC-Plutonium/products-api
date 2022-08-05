

--This is my products styles skus query
Select json_build_object('skus',
	(SELECT json_object_agg(quantitysize.id, quantitysize.details) from
	(SELECT sku.id, json_build_object('quantity', sku.quantity, 'size', sku.size) as details from
	(select id as style_id,
			  name, original_price::text, coalesce(sale_price::text, '0') as sale_price, default_style::bool as "default?", coalesce (sp.photos, '[]') AS photos
			  from style s
			  LEFT JOIN LATERAL
			  (SELECT json_agg(json_build_object('thumbnail_url', sp.thumbnail_url, 'url', sp.url)) as photos from photos sp where sp.styleid = s.id) sp on true
			  where s.productid = 37313) as styles
			  LEFT JOIN (
			  SELECT * FROM SKU
			  ) as sku ON styles.style_id = sku.styleid
			  group by sku.quantity, sku.size, sku.id) as quantitysize));

      Select json_build_object(
	'product_id',
	'37313',
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
			  where s.productid = 37313) as styles
			  LEFT JOIN (
			  SELECT * FROM SKU
			  ) as sku ON styles.style_id = sku.styleid
			  group by sku.quantity, sku.size, sku.id) as quantitysize) as skus
	  from style s
	  LEFT JOIN LATERAL
	  (SELECT json_agg(json_build_object('thumbnail_url', sp.thumbnail_url, 'url', sp.url)) as photos from photos sp where sp.styleid = s.id) sp on true
		  where s.productid = 37313) a)
);