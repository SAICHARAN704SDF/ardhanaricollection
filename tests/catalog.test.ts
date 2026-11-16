import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { products } from '../lib/mock-data/catalog';
import { validateEntry, storefront } from '../lib/catalog/model';

test('publish requires care, composition and a collection; rejects invalid prices and unsafe images',()=>{
 const p={...products[0],publication:'published'};
 assert.throws(()=>validateEntry('product',{...p,care:[]}),/care/);
 assert.throws(()=>validateEntry('product',{...p,price:-1}),/price/);
 assert.throws(()=>validateEntry('product',{...p,images:[{src:'javascript:alert(1)'}]}),/image/);
 assert.equal(validateEntry('product',p).name,p.name);
});

test('catalog persists publishing, protects concurrent edits, and hides archived entries',async()=>{
 const directory=await mkdtemp(path.join(tmpdir(),'ardhanari-catalog-'));
 process.env.CATALOG_DATA_DIRECTORY=directory;
 try {
 const {readCatalog,saveEntry,publicCatalog}=await import('../lib/catalog/repository');
 const initial=await readCatalog();
 const collection={slug:'qa-edit',name:'QA edit',description:'Test collection',image:'/images/heritage-saree-0.jpg',publication:'draft',sample:false};
 let saved=await saveEntry('collection',collection,initial.revision,false);
 assert.ok(!storefront(saved).collections.some(c=>c.slug===collection.slug));
 saved=await saveEntry('collection',{...collection,publication:'published'},saved.revision,true);
 const product={...products[0],id:'qa-product',slug:'qa-product',name:'QA product',collections:['qa-edit'],publication:'draft',sample:false};
 saved=await saveEntry('product',product,saved.revision,false);
 assert.ok(!(await publicCatalog()).products.some(p=>p.id===product.id));
 saved=await saveEntry('product',{...product,publication:'published'},saved.revision,true);
 assert.ok((await publicCatalog()).products.some(p=>p.id===product.id));
 assert.equal((await readCatalog()).revision,saved.revision);
 await assert.rejects(saveEntry('product',product,0,true),/another tab/);
 await assert.rejects(saveEntry('collection',collection,saved.revision,false),/already uses/);
 saved=await saveEntry('product',{...product,publication:'archived'},saved.revision,true);
 assert.ok(!(await publicCatalog()).products.some(p=>p.id===product.id));
 } finally {delete process.env.CATALOG_DATA_DIRECTORY; await rm(directory,{recursive:true,force:true});}
});
