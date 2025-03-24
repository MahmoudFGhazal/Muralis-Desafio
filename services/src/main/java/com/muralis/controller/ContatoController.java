package com.muralis.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.muralis.modal.Cliente;
import com.muralis.modal.Contato;
import com.muralis.service.ClienteService;
import com.muralis.service.ContatoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/contato")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ContatoController {

    private final ContatoService contatoService;
    private final ClienteService clienteService;

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<Object> listAllByCliente(@PathVariable Integer clienteId){
        List<Contato> contatos = contatoService.listAllByCliente(clienteId);
        return ResponseEntity.ok(contatos); 
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contato> getById(@PathVariable Integer id){
        Optional<Contato> contato = contatoService.getById(id);
        return contato.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Contato> addContato(@RequestBody Contato contato){
        if (contato.getCliente() == null || contato.getCliente().getId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // Retorna erro se cliente não for fornecido
        }

        Integer clienteId = contato.getCliente().getId();
        Optional<Cliente> cliente = clienteService.getById(clienteId);

        if (!cliente.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Cliente não encontrado
        }

        contato.setCliente(cliente.get());
        Contato newContato = contatoService.save(contato);

        return ResponseEntity.status(HttpStatus.CREATED).body(newContato);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Contato> updateContato(@PathVariable Integer id, @RequestBody Contato contatoAtualizado) {
        Optional<Contato> contatoExistente = contatoService.getById(id);
        
        if (contatoExistente.isPresent()) {
            Contato atualizado = contatoService.update(id, contatoAtualizado);
            return ResponseEntity.ok(atualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id){
        contatoService.delete(id);
        return ResponseEntity.noContent().build();

    }
}
