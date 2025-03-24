package com.muralis.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.muralis.modal.Contato;
import java.util.List;

@Repository
public interface ContatoRepository extends JpaRepository<Contato, Integer>{
    List<Contato> findByClienteId(Integer clienteId);

    @Transactional
    void deleteByClienteId(Integer clienteId);
}
