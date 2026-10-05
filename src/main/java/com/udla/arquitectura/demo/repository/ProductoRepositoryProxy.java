package com.udla.arquitectura.demo.repository;

import com.udla.arquitectura.demo.model.Producto;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Primary
public class ProductoRepositoryProxy implements ProductoRepository {

    private final RepositorioProductoEnMemoria repositorioReal;

    public ProductoRepositoryProxy(RepositorioProductoEnMemoria repositorioReal) {
        this.repositorioReal = repositorioReal;
    }

    @Override
    public List<Producto> listarTodos() {

        System.out.println("[PROXY] Solicitud para listar productos");

        long inicio = System.currentTimeMillis();

        List<Producto> productos = repositorioReal.listarTodos();

        long fin = System.currentTimeMillis();

        System.out.println("[PROXY] Tiempo de consulta: " + (fin - inicio) + " ms");

        return productos;
    }

    @Override
    public Producto buscarPorId(Long id) {

        System.out.println("[PROXY] Solicitud para buscar producto ID: " + id);

        long inicio = System.currentTimeMillis();

        Producto producto = repositorioReal.buscarPorId(id);

        long fin = System.currentTimeMillis();

        System.out.println("[PROXY] Tiempo de consulta: " + (fin - inicio) + " ms");

        return producto;
    }
}