-- Update image URLs to use public paths that work in production
UPDATE products 
SET image_url = CASE 
  WHEN image_url = '/src/assets/cafe-blueprint.jpg' THEN '/images/cafe-blueprint.jpg'
  WHEN image_url = '/src/assets/online-shop-blueprint.jpg' THEN '/images/online-shop-blueprint.jpg'
  WHEN image_url = '/src/assets/digital-marketing-blueprint.jpg' THEN '/images/digital-marketing-blueprint.jpg'
  WHEN image_url = '/src/assets/restaurant-blueprint.jpg' THEN '/images/restaurant-blueprint.jpg'
  WHEN image_url = '/src/assets/skincare-blueprint.jpg' THEN '/images/skincare-blueprint.jpg'
  WHEN image_url = '/src/assets/food-truck-blueprint.jpg' THEN '/images/food-truck-blueprint.jpg'
  WHEN image_url = '/src/assets/online-course-blueprint.jpg' THEN '/images/online-course-blueprint.jpg'
  WHEN image_url = '/src/assets/dropship-blueprint.jpg' THEN '/images/dropship-blueprint.jpg'
  WHEN image_url = '/src/assets/photography-blueprint.jpg' THEN '/images/photography-blueprint.jpg'
  WHEN image_url = '/src/assets/consulting-blueprint.jpg' THEN '/images/consulting-blueprint.jpg'
  WHEN image_url = '/src/assets/fitness-blueprint.jpg' THEN '/images/fitness-blueprint.jpg'
  ELSE image_url
END
WHERE category = 'Business Blueprint';